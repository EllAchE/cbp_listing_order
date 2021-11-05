import { Feed, Item, LoggingResponse } from "./typing";
import { CronJob } from 'cron';
import { checkIfTitleIsAllListing, createBaseLoggingResponse, getLastTitle, getTradingPairsFromTitle, initializeLastTitle, updateLastTitle } from "./utils";
import { logger } from "./logger";
import { executeTrades } from "./custom_methods";
import * as Parser from "rss-parser";

const rss = require('rss-parser');

const cronString = `0 * 23,7-23 * * *`; // run every minute, all hours except midnight-7am. Need to check TZ // also could probably ignore saturdays as possible listing date

export const cronUpdate = new CronJob(cronString, function (): void {
    logger.info(`Coinbase listing cron executed at ${new Date().toLocaleString()}`);
    try {
        checkFeed().then(logResponses => {
            logResponses.forEach(logResponse => {
                logger.info(JSON.stringify(logResponse));
            }
            )
        }).catch(err => logger.error(err))
    }
    catch (err) {
        logger.error(`cron error`, err) // promise return means this catch block shouldn't be executed
    }
}, null, false);

export const getBlogTitle = async (): Promise<string | undefined> => {
    try {
        const parser: Parser<Feed, Item> = new rss();
        const feed: Feed = await parser.parseURL('https://blog.coinbase.com/feed');
        const title = feed.items[0].title;

        logger.info(`title parsed from rss feed ${title}`)
        return title; // other option is content:encoded
    }
    catch (err) {
        logger.error("errror retrieving feed results", err)
        return undefined;
    }
}

const checkFeed = async (): Promise<LoggingResponse[]> => {
    const title = await getBlogTitle();
    const lastTitle: string = getLastTitle();

    if (!title) {
        logger.error("errror retrieving title from feed results")
        const logResponse = createBaseLoggingResponse({ titleChanged: false, error: "error retrieving title from feed results", buyOrderResult: undefined, sellOrderResult: undefined });
        return [logResponse];
    }
    else if (title != lastTitle) { // execute orders here
        logger.info(`title changed! It used to be ${lastTitle}, now it is ${title}`)
        updateLastTitle(title)
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


(async () => {
    if (!process.env.key || !process.env.passphrase || !process.env.secret) logger.error('missing secret, passphrase or key. Exiting execution')
    else {
        logger.info(`initalizing title`)
        await initializeLastTitle()
        logger.info(`title set to ${getLastTitle()}`)
    }
    logger.info('Launching coinbase monitoring cronjob')
    cronUpdate.start() // launch the cron
})();

