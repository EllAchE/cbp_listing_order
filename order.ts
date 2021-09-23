const CronTime = require('cron').CronTime;
const rss = require('rss-parser');

// client sdk https://github.com/coinbase/coinbase-pro-node
// Listing data https://docs.google.com/spreadsheets/d/1y0SE1DtbaUltUHtGBzBgz9BXgzKGvk5SF1xjjK52grw/edit#gid=0


// fetch the price of asset for cases where placing limit order
// support market order
// send telegram alert when order is placed (optional)
// send alert when order is complete (optional but impt imo)
// checks should be via cron or similar 

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hourse except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

// run for both cbp and cb
got(site.url).then(response => {
    const parser = new rss();
    content = await parser.parseString(response.body)
    content = content.items[0][site.contentSelector];
} break;