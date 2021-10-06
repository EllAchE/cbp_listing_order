import { placeOrder } from "./api_methods";
import { LoggingResponse } from "./typing";

const got = require('got');
const CronTime = require('cron').CronTime;
const rss = require('rss-parser');

const regPatternAll = new RegExp(/(?<=\()(\w{1,5})(?=\) is now available on Coinbase)/)
// const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/)
// Can't actually order Pro listings on Pro when they come out

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hours except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

const getTitle = async (): Promise<string> => {
    return await got('https://blog.coinbase.com/feed').then(response => {
        const parser = new rss();
        const content = parser.parseString(response.body)
        return content.items[0]['title']; // other option is content:encoded
    })
}

// run for both cbp and cb
const checkFeed = async (lastTitle: string): Promise<LoggingResponse> => {
    const title = await getTitle();

    if (title != lastTitle) { // execute orders here
        lastTitle = title;
        const regResultAll = regPatternAll.exec(title);

        if (regResultAll.length != 1) {// can have more checks here if needed
            return {
                "successfulOrder": false,
                "title": lastTitle,
                "error": "regex retrieval returned array with more than one element"
            }
        }

        if (regResultAll) { // will be null if nothing matches
            const tradingPair = `USD-${regResultAll[0]}` // Assuming everything has a USD pair on cbp, seems to
            placeOrder(true, false, undefined, 300, tradingPair)// naive implementation, immediate market order of $300
        }
    }
}
