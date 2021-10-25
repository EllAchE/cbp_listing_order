// Assumes that an immediate purchase was made upon listing on all

import { OrderResult } from "coinbase-pro";
import { placeMarketOrder } from "./api_interaction";


export const sellLogic = async (boughtTokenAmount: string, tradingPair: string): Promise<OrderResult> => {
    // wait for 1 min, then immediately set a stop limit for the price at the time of the listing
    // sell 2 min after receiving an order response
    // sell after 5 min no matter what
    // Need to revisit this logic. 
    /*
        Options are: Stop Limit, Limit, Market after time, constantly rising limit (trailing limit)
    */
    sleep(180) // poor implementation of await, but setTimeout return type is weird
    return await placeMarketOrder(false, boughtTokenAmount, tradingPair)
}

function sleep(seconds: number): void {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) { }
}