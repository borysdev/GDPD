const fs = require("node-fs-extra")
const ffs = require("fs")

let nmChromiumPath = __dirname + "/../node_modules/puppeteer/.local-chromium/";
nmChromiumPath += ffs.readdirSync(nmChromiumPath)[1]
nmChromiumPath += '/chrome-mac/Chromium.app';

let asar = __dirname + "/../build/Desktop\ Application.app/Contents/Resources/app.asar.unpacked/node_modules/puppeteer/.local-chromium/"
asar += ffs.readdirSync(asar)[0]
asar += "/chrome-mac/Chromium.app";

let old = asar+"";
//ffs.renameSync(asar, asar+"_old");
require('rimraf')(asar, () => {
    console.log(ffs.existsSync(old));
    fs.copy(nmChromiumPath, asar);    
});
//dir = require()