import { OrderResult } from "coinbase-pro";

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
    buyOrderResult: OrderResult | undefined
    sellOrderResult: OrderResult | undefined
    title: string
    titleChanged: boolean
    error: string | undefined
    time: string
}

export interface Feed {
    items: Item[]
}

export interface Item {
    title: string,
    creator: string,
    guid: string,
    link: string,
    pubDate: string,
    timestamp: string,
    isoDate: string
}