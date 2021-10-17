import { OrderResult } from "coinbase-pro";
import { placeMarketOrder } from "./api_interaction";

// export const handleTrigger = async (newListing: string, preferredTradingPair: string): Promise<ResponseCode> => {
//     const tradingPairs = getTradingPairs(newListing, preferredTradingPair)
//     return ResponseCode.SUCCESS;
// }

export async function initialPurchase(regResultAll: RegExpExecArray, lastTitle: string, marketOrderAmount: string): Promise<OrderResult> {
    const tradingPair = `USD-${regResultAll[0]}`; // Assuming everything has a USD pair on cbp, seems to be
    return await placeMarketOrder(true, marketOrderAmount, tradingPair); // naive implementation, immediate market order of $3000
}