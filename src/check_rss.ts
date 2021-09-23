const got = require('got');

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hourse except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

// run for both cbp and cb
got(site.url).then(response => {
    const parser = new rss();
    content = await parser.parseString(response.body)
    content = content.items[0][site.contentSelector];
} break;