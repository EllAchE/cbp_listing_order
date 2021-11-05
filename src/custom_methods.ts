import { OrderResult } from "coinbase-pro";
import { placeMarketOrder } from "./api_interaction";
import { sellLogic } from "./listing_sell_logic";
import { logger } from "./logger";
import { LoggingResponse } from "./typing";
import { createBaseLoggingResponse, marketOrderAmount } from "./utils";

// export const handleTrigger = async (newListing: string, preferredTradingPair: string): Promise<ResponseCode> => {
//     const tradingPairs = getTradingPairs(newListing, preferredTradingPair)
//     return ResponseCode.SUCCESS;
// }

export async function initialPurchase(tradingPair: string, marketOrderAmount: string): Promise<OrderResult> {
    return await placeMarketOrder(true, marketOrderAmount, tradingPair); // naive implementation, immediate market order of specified amount
}

export function executeTrades(tradingPairArray: string[], lastTitle: string) {
    const arr: Promise<LoggingResponse>[] = [];

    tradingPairArray.forEach(pair => {
        arr.push(initialPurchase(pair, marketOrderAmount).then(async (buyOrderResult) => { // Buy Orders/Purchases happen here
            logger.info(`received order result: ${buyOrderResult}`);

            // todo this needs better logic to wait if trade doesn't instantly settle
            if (!buyOrderResult.settled) logger.warn('trade hasn\'t settled, attempting to sell regardless (even though buy was a market), so expect an error.');
            try {
                const sellOrderResult: OrderResult = await sellLogic(buyOrderResult.id, buyOrderResult.product_id); // sell orders happen here, async
                const logResponse = createBaseLoggingResponse({ title: lastTitle, buyOrderResult: buyOrderResult, sellOrderResult: sellOrderResult, error: undefined });
                logger.info(logResponse);
                return logResponse;
            }
            catch (err) {
                return createBaseLoggingResponse({ title: lastTitle, buyOrderResult: buyOrderResult, sellOrderResult: undefined, error: err })
            }
        }).catch(err => {
            logger.error('error with buy order', err)
            return createBaseLoggingResponse({ title: lastTitle, buyOrderResult: undefined, sellOrderResult: undefined, error: err })
        }));
    });

    const returnArr: LoggingResponse[] = []; // this is done just to return a logging object
    arr.forEach(async (elem) => {
        returnArr.push(await elem); // yhid 
    });

    return returnArr;
}
