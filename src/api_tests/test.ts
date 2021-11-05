require('jest')
import { placeLimitOrder, placeMarketOrder } from "../api_interaction";
import { initaliazeAuthedClient } from "../client";

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

//export const placeMarketOrder = async (isBuy: boolean, amount: string, tradingPair: string): Promise<OrderResult> => {
describe('should place market buy order', () => {
    it('Should place market buy order', async () => {
        const orderResult = await placeMarketOrder(true, "5", "ETH-USD") // place a market order to buy $5 of ETH at market price
        expect(orderResult).toHaveProperty("id")
        expect(orderResult.product_id).toBe("ETH-USD")
        expect(orderResult.filled_size).toBe("0")
    })
})

describe('should place market sell order', () => {
    it('Should place market sell order', async () => {
        const orderResult = await placeMarketOrder(false, "5", "ETH-USD") // place a market order to sell $5 of ETH at market price 
        expect(orderResult).toHaveProperty("id")
        expect(orderResult.product_id).toBe("ETH-USD")
        expect(orderResult.filled_size).toBe("0")
    })
})

