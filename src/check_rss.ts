import { Feed, Item, LoggingResponse } from "./typing";
import { CronJob } from 'cron';
import { checkIfTitleIsAllListing, createBaseLoggingResponse, getTradingPairsFromTitle } from "./utils";
import { logger } from "./logger";
import { executeTrades } from "./custom_methods";
import Parser = require("rss-parser");

//const fs = require('fs');
//const got = require('got');
const rss = require('rss-parser');

const cronString = `*/5 * 23,7-23 * * *`; // run every minute, all hours except midnight-7am. Need to check TZ // also could probably ignore saturdays as possible listing date

var lastTitle;

export const cronUpdate = new CronJob(cronString, function (): void {
    logger.info(`Coinbase listing cron executed at ${new Date().toLocaleString()}`);
    try {
        // const lastTitle = fs.readJsonSync('dist/json/last_title.json').title; save title if wanted
        checkFeed(lastTitle).then(logResponses => {
            logResponses.forEach(logResponse =>
                logger.info(logResponse.toString())
            )
        }).catch(err => logger.error(err))
    }
    catch (err) {
        logger.error(`cron error`, err) // promise return means this catch block shouldn't be executed
    }
}, null, false);

export const getBlogTitle = async (): Promise<string | undefined> => {
    try {
        //const feedResponse = await got('https://blog.coinbase.com/feed');
        const parser: Parser<Feed, Item> = new rss();
        const feed: Feed = await parser.parseURL('https://blog.coinbase.com/feed'); // this function is async
        const title = feed.items[0].title;

        logger.info(`title parsed from rss feed ${title}`)
        return title; // other option is content:encoded
    }
    catch (err) {
        logger.error("errror retrieving feed results", err)
        return undefined;
    }
}

const checkFeed = async (lastTitle: string): Promise<LoggingResponse[]> => {
    const title = await getBlogTitle();

    if (!title) {
        logger.error("errror retrieving title from feed results")
        const logResponse = createBaseLoggingResponse({ titleChanged: false, error: "error retrieving title from feed results", buyOrderResult: undefined, sellOrderResult: undefined });
        return [logResponse];
    }
    else if (title != lastTitle) { // execute orders here
        lastTitle = title;
        let tradingPairArray: string[];

        if (checkIfTitleIsAllListing(title)) {
            tradingPairArray = getTradingPairsFromTitle(title);
            logger.info(`retrieved trading pair from new title, value is ${tradingPairArray}`)
            return executeTrades(tradingPairArray, lastTitle);
        }
        else {
            logger.info(`regex didn't find a match on the title, or somehow returned null. Title was ${title}`)
            const logResponse = createBaseLoggingResponse({ title: lastTitle, error: "regex retrieval didn't find a match, or somehow returned null", buyOrderResult: undefined, sellOrderResult: undefined });
            return [logResponse];
        }
    }
    else { // can have more checks here if needed
        const logResponse = createBaseLoggingResponse({ title: lastTitle, titleChanged: false, error: undefined, buyOrderResult: undefined, sellOrderResult: undefined });
        return [logResponse];
    }
}

