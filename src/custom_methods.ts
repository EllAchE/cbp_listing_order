import { OrderResult } from "coinbase-pro";
import { placeMarketOrder } from "./api_interaction";

// export const handleTrigger = async (newListing: string, preferredTradingPair: string): Promise<ResponseCode> => {
//     const tradingPairs = getTradingPairs(newListing, preferredTradingPair)
//     return ResponseCode.SUCCESS;
// }

export async function initialPurchase(tradingPair: string, marketOrderAmount: string): Promise<OrderResult> {
    return await placeMarketOrder(true, marketOrderAmount, tradingPair); // naive implementation, immediate market order of specified amount
}
