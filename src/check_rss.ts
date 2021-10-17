import { LoggingResponse } from "./typing";
import { CronJob } from 'cron';
import { OrderResult } from "coinbase-pro";
import { initialPurchase } from "./custom_methods";

const got = require('got');
const rss = require('rss-parser');
const marketOrderAmount = '3000' // must be a string for api methods
const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hours except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date

var lastTitle;
export const cronUpdate = new CronJob(cronString, function (): void {
    console.log(`Coinbase listing cron executed at ${new Date().toLocaleString()}`);
    try {
        checkFeed(lastTitle)
    }
    catch (err) {
        console.log(`cron error`, err)
    }
}, null, false);

const getTitle = async (): Promise<string> => {
    return await got('https://blog.coinbase.com/feed').then(response => {
        const parser = new rss();
        const content = parser.parseString(response.body)
        return content.items[0]['title']; // other option is content:encoded
    })
}

const regPatternAll = new RegExp(/(?<=\()(\w{1,5})(?=\) is now available on Coinbase)/)
// const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/)
// only runs for regular listings, can't buy on cbp when they list

const checkFeed = async (lastTitle: string): Promise<LoggingResponse> => {
    const title = await getTitle();

    if (title != lastTitle) { // execute orders here
        lastTitle = title;
        const regResultAll = regPatternAll.exec(title);

        if (!regResultAll || regResultAll.length < 1) { // can have more checks here if needed
            return {
                "orderResult": undefined,
                "title": lastTitle,
                "titleChanged": true,
                "error": "regex retrieval didn't find a match, or somehow returned null"
            }
        }
        else if (regResultAll && regResultAll.length === 1) { // will be null if nothing matches
            const orderResult: OrderResult = await initialPurchase(regResultAll, lastTitle, marketOrderAmount);
            return {
                "orderResult": orderResult,
                "title": lastTitle,
                "titleChanged": true,
                "error": undefined // todo add try catch here and everywhere
            };
        }
        else { // can have more checks here if needed
            return {
                "orderResult": undefined,
                "title": lastTitle,
                "titleChanged": true,
                "error": "regex retrieval returned array with more than one element"
            }
        }
    }

    else {
        return {
            "orderResult": undefined,
            "title": lastTitle,
            "titleChanged": false,
            "error": undefined
        }
    }
}
