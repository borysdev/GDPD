const puppeteer = require('puppeteer');
const fs = require('node-fs-extra');
const ffs = require('fs');
const os = require('os');
console.log(os.type());

const LOGIN_PAGE = 'https://www.linkedin.com/uas/login';
const LOGIN_LOG_INPUT = '#session_key-login';
const LOGIN_PASS_INPUT = '#session_password-login';

import {
  FETCH_MUTUALS_LINK,
  GO_TO_NEXT_PAGE,
  FETCH_MUTUALS_LIST,
  PROSPECT_INFO,
  QUERY_HIGHLIGHTS_BLOCK,
  QUERY_NEXT_BUTTON,
  USER_AVATAR,
  QUERY_PROFILE_BLOCK,
  QUERY_PROFILE_READY,
  MUTUALS_COUNT
} from '../utils/query';

async function snap(page, message) {
  console.info('---| ' + message);
  await page.screenshot({
    path: 'snap.png'
  });
}

if (os.type() === 'Darwin') require('fix-path')();

let exPath = puppeteer
  .executablePath()
  .replace('app.asar', 'app.asar.unpacked');
  
if (os.type() === 'Darwin') {
  require('fix-path')();

  let userDir = os.userInfo().homedir + '/.desk_app';
  let executableDir = exPath.replace(/\Chromium$/, '') + '/../../../';
  let macPkgBin = '/Contents/MacOS/Chromium';

  if (!ffs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
    fs.copy(executableDir, userDir, e => {
      if (e) alert(e);
    });
  }
  exPath = userDir + '/Chromium.app' + macPkgBin;
}

export function LinkedInService($progress) {
  let browser, page;

  return {
    list: null,
    authorized: false,
    login: '',
    pass: '',
    profile: {},

    parseInitialList(file) {
      this.list = JSON.parse(require('fs').readFileSync(file.path));
      console.log('parsed', this.list);
    },

    async newSession() {
      let viewport = {
        height: 1024,
        width: 840
      };

      browser = await puppeteer.launch({
        executablePath: exPath,
        headless: false,
        defaultViewport: viewport,
        slowMo: 50
      });

      page = await browser.newPage();

      await page.setViewport(viewport);
      this.authorized = false;
    },

    async authorize() {
      await this.newSession();
      $progress.reset();
      page.goto(LOGIN_PAGE);
      $progress.add(5);
      console.log('login...');
      await page.waitForNavigation({
        waitUntil: 'load'
      });
      console.log('loaded login');
      $progress.add(5);
      await page.focus(LOGIN_LOG_INPUT);
      await page.type(LOGIN_LOG_INPUT, this.login);
      await page.focus(LOGIN_PASS_INPUT);
      await page.type(LOGIN_PASS_INPUT, this.pass);

      await page.evaluate("document.querySelector('#btn-primary').click()");
      $progress.add(5);
      this.authorized = true;
      await page.waitForFunction(
        'location.href.includes("https://www.linkedin.com/feed/")',
        {
          timeout: 10000
        }
      );
      $progress.add(5);
      await page.setViewport({
        width: 840,
        height: 1524
      });
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
      let hasMutuals = false,
        mutualsLink,
        prospect;

      try {
        await page.waitForFunction(QUERY_PROFILE_READY);
        prospect = await page.evaluate(PROSPECT_INFO);

        try {
          await page.waitForFunction(QUERY_HIGHLIGHTS_BLOCK);
          hasMutuals = true;
        } catch (e) {
          console.log('No mutuals with contact');
        }
      } catch (e) {
        console.log('Cant load profile info');
        return {};
      }

      if (hasMutuals) {
        $progress.totalMutuals = await page.evaluate(MUTUALS_COUNT);
        console.log('Total mutuals: ' + $progress.totalMutuals);
        mutualsLink = await page.evaluate(FETCH_MUTUALS_LINK);
      }

      return {
        mutualsLink: hasMutuals ? mutualsLink : null,
        prospect
      };
    },
    async getMutualsFrom(link) {
      console.log('going to mutuals', link);
      await page.goto(link);
      let hasNextPage = true;
      let mutuals = [];
      let prevUrl = 0;
      while (hasNextPage) {
        await page.waitForFunction(`'${prevUrl}' !== location.href`);
        await page.waitFor(500);

        let m = await page.evaluate(FETCH_MUTUALS_LIST);
        console.log(`Scrapped from page ${m.length} users.`, m);
        mutuals = [...mutuals, ...m];

        hasNextPage = await page.evaluate(QUERY_NEXT_BUTTON);

        prevUrl = await page.evaluate(`location.href`);
        console.log(
          `Has next page: ${hasNextPage}. Fetched ${mutuals.length} mutuals`
        );
        $progress.stepMutualScan();
        if (hasNextPage) await page.evaluate(GO_TO_NEXT_PAGE);
      }
      return mutuals;
    },
    async processInitialList() {
      let contacts = this.list.Contacts;
      $progress.totalProspects = contacts.length;

      if (!this.authorized) {
        await this.authorize();
      }

      // $progress.add(5);
      //profile = await this.getUserData();

      // parsed.myImage = profile.avatar;
      //$progress.add(20);
      for (const contact of contacts) {
        let mutualsLink;
        try {
          let res = await this.parseProspectProfile(
            contact.linkedInProfileLink
          );
          mutualsLink = res.mutualsLink;
          console.log('prospect', res);
          Object.assign(contact, res.prospect);
        } catch (e) {
          console.error('Tried to scan non-mutual', e);
          continue;
        }
        $progress.stepProspectScan();
        if (mutualsLink) {
          contact.MutualContacts = await this.getMutualsFrom(mutualsLink);
        }
        contact.MutualContacts = contact.MutualContacts.map(m => ({
          name: m.name,
          linkedInProfileLink: m.url
        }));
      }
      console.log('DONE', this.list);
      browser.close();
      return this.list;
    }
  };
}
