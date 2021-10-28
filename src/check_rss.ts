import { LoggingResponse } from "./typing";
import { CronJob } from 'cron';
import { OrderResult } from "coinbase-pro";
import { initialPurchase } from "./custom_methods";
import { sellLogic } from "./listing_sell_logic";
import { getTradingPairFromRegResult, marketOrderAmount } from "./utils";
import { logger } from "./logger";

//const fs = require('fs');
const got = require('got');
const rss = require('rss-parser');

const cronString = `0 * 23,7-23 * * *`;
// run every minute, all hours except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date
const regPatternAll = new RegExp(/(?<=\()(\w{1,5})(?=\) is now available on Coinbase)/)
// const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/)
// only runs for regular listings, can't buy on cbp when they list
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

const checkFeed = async (lastTitle: string): Promise<LoggingResponse> => {
    const title = await getTitle();

    if (title != lastTitle) { // execute orders here
        lastTitle = title;
        const regResultAll = regPatternAll.exec(title);

        if (!regResultAll || regResultAll.length < 1) { // can have more checks here if needed
            return {
                "buyOrderResult": undefined,
                "sellOrderResult": undefined,
                "title": lastTitle,
                "titleChanged": true,
                "error": "regex retrieval didn't find a match, or somehow returned null",
                "time": new Date().toLocaleDateString()
            }
        }
        else if (regResultAll && regResultAll.length === 1) { // will be null if nothing matches
            const tradingPair = getTradingPairFromRegResult(regResultAll); // Assuming everything has a USD pair on cbp, seems to be
            logger.info(`retrieved trading pair from new title, value is ${tradingPair}`)

            if (tradingPair) {
                const buyOrderResult: OrderResult = await initialPurchase(tradingPair, marketOrderAmount);
                logger.info(`received order result: ${buyOrderResult}`)

                const settledTrade = buyOrderResult.settled;
                const boughtTokenAmount = buyOrderResult.executed_value;
                const tradingPairReturn = buyOrderResult.product_id; // todo validate that these types are good

                if (!settledTrade) logger.warn('trade hasn\'t settled, attempting to sell regardless (even though buy was a market, so expect an error.')

                const sellOrderResult: OrderResult = await sellLogic(boughtTokenAmount, tradingPairReturn);
                return {
                    "buyOrderResult": buyOrderResult,
                    "sellOrderResult": sellOrderResult,
                    "title": lastTitle,
                    "titleChanged": true,
                    "error": undefined,
                    "time": new Date().toLocaleDateString() // todo add try catch here and everywhere
                };
            }
            else {
                logger.warn('trading pair ended up undefined or had multiple matches')
                return {
                    "buyOrderResult": undefined,
                    "sellOrderResult": undefined,
                    "title": lastTitle,
                    "titleChanged": true,
                    "error": 'trading pair ended up undefined',
                    "time": new Date().toLocaleDateString() // todo add try catch here and everywhere
                };
            }

        }
        else { // can have more checks here if needed
            return {
                "buyOrderResult": undefined,
                "sellOrderResult": undefined,
                "title": lastTitle,
                "titleChanged": true,
                "error": "regex retrieval returned array with more than one element",
                "time": new Date().toLocaleDateString()
            }
        }
    }

    else {
        return {
            "buyOrderResult": undefined,
            "sellOrderResult": undefined,
            "title": lastTitle,
            "titleChanged": false,
            "error": undefined,
            "time": new Date().toLocaleDateString()
        }
    }
}
