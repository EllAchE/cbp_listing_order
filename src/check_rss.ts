const got = require('got');
const crypto1 = require('crypto');

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hourse except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

// run for both cbp and cb
got('https://blog.coinbase.com/feed').then(response => {
    const parser = new rss();
    const content = await parser.parseString(response.body)
    const firstItem = content.items[0]['title']; // other option is content:encoded
    const hash = crypto.createHash(`md5`).update(content).digest(`hex`); //Get content of site
} break;