import { OrderParams, LimitOrder } from "coinbase-pro";

// export interface MarketOrder {
//     //side: string
//     size: number
//     product_id: string
// }

// export interface LimitOrder extends MarketOrder {
//     price: number
// }

export enum ResponseCode {
    SUCCESS = "200 OK",
    FAILURE = "500 ERROR"
}

export enum BuyOrSellString {
    Buy = "buy",
    Sell = "sell"
}

export interface BuySellPairs {
    buyPairs: any
    sellPairs: any
}

export interface TradingPair {
    id: string
    base_currency: string
    quote_currency: string
}

export interface OrderBook {
    any
}

export interface LoggingResponse {
    successfulOrder: boolean
    title: string
    error: string
}