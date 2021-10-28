import { LoggingResponse } from "./typing";
import { CronJob } from 'cron';
import { createBaseLoggingResponse, getTradingPairsFromTitle } from "./utils";
import { logger } from "./logger";
import { executeTrades } from "./custom_methods";

//const fs = require('fs');
const got = require('got');
const rss = require('rss-parser');

const cronString = `0 * 23,7-23 * * *`; // run every minute, all hours except midnight-7am. Need to check TZ // also could probably ignore saturdays as possible listing date
const regPatternAllSingle = new RegExp(/(?<=\()(\w{1,10})(?=\) is now available on Coinbase)/i) // for singular item listing
const regPatternAllMultiple = new RegExp(/(?<=\()(\w{1,10})(?=\) are now available on Coinbase)/i) // for multiple item listing
// const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/) // only runs for regular listings, can't buy on cbp when they list

var lastTitle;

export const cronUpdate = new CronJob(cronString, function (): void {
    logger.info(`Coinbase listing cron executed at ${new Date().toLocaleString()}`);
    try {
        // const lastTitle = fs.readJsonSync('dist/json/last_title.json').title; save title if wanted
        checkFeed(lastTitle).then(logResponse => {
            logger.info(logResponse);
        }).catch(err => logger.error(err))
    }
    catch (err) {
        logger.error(`cron error`, err) // promise return means this catch block shouldn't be executed
    }
}, null, false);

const getTitle = async (): Promise<string> => {
    return await got('https://blog.coinbase.com/feed').then(response => {
        const parser = new rss();
        const content = parser.parseString(response.body)
        return content.items[0]['title']; // other option is content:encoded
    }).catch(err => {
        logger.error("errror retrieving feed results", err)
    })
}

const checkFeed = async (lastTitle: string): Promise<LoggingResponse[]> => {
    const title = await getTitle();

    if (title != lastTitle) { // execute orders here
        lastTitle = title;
        let tradingPairArray: string[];

        if (regPatternAllMultiple.test(title) || regPatternAllSingle.test(title)) {
            tradingPairArray = getTradingPairsFromTitle(title);
            logger.info(`retrieved trading pair from new title, value is ${tradingPairArray}`)
            return executeTrades(tradingPairArray, lastTitle);
        }
        else {
            logger.info("regex didn't find a match on the title, or somehow returned null. Title was", title)
            const logResponse = createBaseLoggingResponse({ title: lastTitle, error: "regex retrieval didn't find a match, or somehow returned null", buyOrderResult: undefined, sellOrderResult: undefined });
            return [logResponse];
        }
    }
    else { // can have more checks here if needed
        const logResponse = createBaseLoggingResponse({ title: lastTitle, titleChanged: false, error: undefined, buyOrderResult: undefined, sellOrderResult: undefined });
        return [logResponse];
    }
}
