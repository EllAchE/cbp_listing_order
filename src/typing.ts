export interface MarketOrder {
    size: number
    product_id: string
}

export interface LimitOrder extends MarketOrder {
    price: number
}

export enum ResponseCode {
    SUCCESS = "200 OK",
    FAILURE = "500 ERROR"
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