import {
    request
} from 'https';

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone6 = devices['iPhone 6'];

const LOGIN_PAGE = 'https://www.linkedin.com/uas/login';

import {
    FETCH_MUTUALS_LINK,
    GO_TO_NEXT_PAGE,
    FETCH_MUTUALS_LIST,
    PROSPECT_INFO,
    QUERY_HIGHLIGHTS_BLOCK,
    QUERY_NEXT_BUTTON,
    USER_AVATAR,
    QUERY_PROFILE_BLOCK,
    MUTUALS_COUNT
} from '../utils/query'

async function snap(page, message) {
    console.info('---| ' + message)
    await page.screenshot({
        path: 'example.png'
    });
}

export function LinkedInService($progress) {
    let browser, page;

    return {
        list: null,
        authorized: false,
        profile: {},

        parseInitialList(file) {
            this.list = JSON.parse(require('fs').readFileSync(file.path));
        },

        async newSession() {
            
            
            let exPath = puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
          //  alert('execpath: '+ exPath);

            let viewport = {
                height: 1024,
                width: 840
            }

            browser = await puppeteer.launch({
                executablePath: exPath,
                headless: false,
                defaultViewport: viewport
            });
            
            page = await browser.newPage();

            await page.setViewport(viewport)
            this.authorized = false;
        },

        async authorize() {
            await this.newSession();
            await page.goto(LOGIN_PAGE);
            await page.waitForFunction('location.href.includes("https://www.linkedin.com/feed/")', {
                timeout: 300000
            });
            await page.waitForNavigation({
                waitUntil: 'load'
            });
            this.authorize = true;
            await page.setViewport({
                width: 840,
                height: 1524
            })
        },
        async getUserData() {
            await page.waitForFunction(QUERY_PROFILE_BLOCK);
            let avatar = await page.evaluate(USER_AVATAR);
            return {
                avatar
            };
        },
        async parseProspectProfile(link) {
            await page.goto(link);
            await page.waitForFunction(QUERY_HIGHLIGHTS_BLOCK);

            const prospect = await page.evaluate(PROSPECT_INFO);
            $progress.totalMutuals = await page.evaluate(MUTUALS_COUNT);

            console.log('Total mutuals: ' + $progress.totalMutuals);

            let mutualsLink = await page.evaluate(FETCH_MUTUALS_LINK);
            return {
                mutualsLink,
                prospect
            };
        },
        async getMutualsFrom(link) {
            await page.goto(link);
            let hasNextPage = true;
            let mutuals = [];
            let prevUrl = 0
            while (hasNextPage) {
                await page.waitForFunction(`'${prevUrl}' !== location.href`)
                await page.waitFor(500);

                let m = await page.evaluate(FETCH_MUTUALS_LIST);
                console.log(`Scrapped from page ${m.length} users.`, m);
                mutuals = [...mutuals, ...m];

                hasNextPage = await page.evaluate(QUERY_NEXT_BUTTON);

                prevUrl = await page.evaluate(`location.href`)
                console.log(`Has next page: ${hasNextPage}. Fetched ${mutuals.length} mutuals`);
                $progress.stepMutualScan();
                if (hasNextPage)
                    await page.evaluate(GO_TO_NEXT_PAGE);
            }
            return mutuals;
        },
        async processInitialList() {
            let urls = this.list.urls;

            $progress.totalProspects = urls.length;

            let parsed = {
                id: this.list.id,
                listName: this.list.name,
                instructions: this.list.instruction,
                peopleOfInterest: urls,
                contacts: []
            };
            if (!this.authorized) {
                await this.authorize();
            }
            $progress.add(5);
            let profile = await this.getUserData();
            parsed.myImage = profile.avatar;
            $progress.add(15);
            for (const url of urls) {
                let {
                    mutualsLink,
                    prospect
                } = await this.parseProspectProfile(url);
                $progress.stepProspectScan();
                prospect.mutualContacts = await this.getMutualsFrom(mutualsLink);
                // --- remove this when additional data needed
                prospect.mutualContacts = prospect.mutualContacts.map(m => m.name);
                // ---
                parsed.contacts.push(prospect);
            }
            console.log("DONE", parsed)
            browser.close();
            return parsed;
        }
    };
}