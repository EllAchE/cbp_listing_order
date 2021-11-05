// Assumes that an immediate purchase was made upon listing on all

import { OrderInfo, OrderResult } from "coinbase-pro";
import { getPlacedOrder, placeMarketOrder } from "./api_interaction";
import { logger } from "./logger";


export const sellLogic = async (buyOrderId: string, tradingPair: string): Promise<OrderResult> => { //todo add error checking here
    // wait for 1 min, then immediately set a stop limit for the price at the time of the listing
    // sell 2 min after receiving an order response
    // sell after 5 min no matter what
    // Need to revisit this logic. 
    /*
        Options are: Stop Limit, Limit, Market after time, constantly rising limit (trailing limit)
    */
    logger.info(`attempting to sell value of settled order, will first wait for 180 seconds`)
    sleep(180) // poor implementation of await, but setTimeout return type is weird
    const orderResult: OrderInfo = await getPlacedOrder(buyOrderId) // order should have been placed if market and waiting for 3 minutes

    logger.info(`Waited for 180 seconds. Attempting to sell.`)
    return await placeMarketOrder(false, orderResult.filled_size, tradingPair)
}

function sleep(seconds: number): void {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) { }
}