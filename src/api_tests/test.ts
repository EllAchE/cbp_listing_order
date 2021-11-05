require('jest')
import { placeLimitOrder, placeMarketOrder } from "../api_interaction";
import { initaliazeAuthedClient } from "../client";
import { sellLogic } from "../listing_sell_logic";

initaliazeAuthedClient() // setup client before placing orders
// For this test suite you should check that the open limit orders exist, and that the market orders were actually placed

//export const placeLimitOrder = async (isBuy: boolean, price: string, amount: string, tradingPair: string): Promise<OrderResult> => {
describe('should place limit buy order', () => {
    it('Should place limit order', async () => {
        const orderResult = await placeLimitOrder(true, "0.01", "0.00002100", "BTC-USD") // should place a limit order to buy btc at $0.000001, so should (likely) never execute
        expect(orderResult).toHaveProperty("id")
        expect(orderResult.product_id).toBe("BTC-USD")
        expect(orderResult.filled_size).toBe("0")
    })
})

describe('should place limit sell order', () => {
    it('Should place limit order', async () => {
        const orderResult = await placeLimitOrder(false, "9999999", "0.00002100", "BTC-USD") // should place a limit order to sell btc at $99999999999, so should (likely) never execute
        expect(orderResult).toHaveProperty("id")
        expect(orderResult.product_id).toBe("BTC-USD")
        expect(orderResult.filled_size).toBe("0")
    })
})

// //export const placeMarketOrder = async (isBuy: boolean, amount: string, tradingPair: string): Promise<OrderResult> => {
describe('should place market buy order then sell equivalent amount', () => {
    it('Should place market buy order then sell executed amount. Proxies sell logic without the 180s delay', async () => {
        const buyOrderResult = await placeMarketOrder(true, "5", "ETH-USD") // place a market order to buy $5 of ETH at market price
        expect(buyOrderResult).toHaveProperty("id")
        expect(buyOrderResult.product_id).toBe("ETH-USD")
        expect(buyOrderResult.size).toBe("5")

        const sellOrderResult = await placeMarketOrder(false, "0.00029000", "ETH-USD") // place a market order to sell purchased amount ETH at market price. Some loss from fees
        expect(sellOrderResult).toHaveProperty("id")
        expect(sellOrderResult.product_id).toBe("ETH-USD")
        expect(sellOrderResult.size).toBe("0.00029000")
    })
})

describe('should properly execute sell logic based on the result of a settled order', () => {
    it('should properly execute sell logic based on the result of a settled order', async () => {
        const ethMarketSellOrderId = "31a99ecf-4a31-4784-9598-66efa64f6cfa";
        const ethMarketPair = "ETH-USD";
        const sellOrderResult = await sellLogic(ethMarketSellOrderId, ethMarketPair)
        expect(sellOrderResult).toHaveProperty("id")
        expect(sellOrderResult.product_id).toBe("ETH-USD")
    })
})
