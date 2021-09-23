const got = require('got');
const cryp = require('crypto');
const CronTime = require('cron').CronTime;
const rss = require('rss-parser');

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hourse except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

// run for both cbp and cb
got('https://blog.coinbase.com/feed').then(response => {
    const parser = new rss();
    const content = parser.parseString(response.body)
    const firstItem = content.items[0]['title']; // other option is content:encoded
    const hash = cryp.createHash(`md5`).update(firstItem).digest(`hex`); //Get content of site
})