const got = require('got');
const CronTime = require('cron').CronTime;
const rss = require('rss-parser');

const regPatternAll = new RegExp(/(?<=\()(\w{1,5})(?=\) is now available on Coinbase)/)
const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/)

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hours except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

const initializeTitle = async (): Promise<string> => {
    return await got('https://blog.coinbase.com/feed').then(response => {
        const parser = new rss();
        const content = parser.parseString(response.body)
        return content.items[0]['title']; // other option is content:encoded
    })
}

// run for both cbp and cb
const checkFeed = async (lastTitle: string): Promise<ResponseCode> => {
    got('https://blog.coinbase.com/feed').then(response => {
        const parser = new rss();
        const content = parser.parseString(response.body)
        const title = content.items[0]['title']; // other option is content:encoded

        if (title != lastTitle) { // execute orders here
            lastTitle = title;
        }
    })
}