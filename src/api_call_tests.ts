import { placeLimitOrder } from "./api_interaction";

placeLimitOrder(true, "0.000001", "0.000001", "BTC-USD") // should place a limit order to buy btc at $0.000001, so should (likely) never execute
//placeLimitOrder(true, "99999999999999", "0.000001", "BTC-USD") // should place a limit order to sell btc at $99999999999, so should (likely) never execute
//export const placeLimitOrder = async (isBuy: boolean, price: string, amount: string, tradingPair: string): Promise<OrderResult> => {

//placeMarketOrder(true, "10", "ETH-USD") // place a market order to buy $10 of ETH at market price
//placeMarketOrder(false, "10", "ETH-USD") // place a market order to sell $5 of ETH at market price