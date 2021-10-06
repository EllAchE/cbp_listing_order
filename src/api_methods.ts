const cbp = require('coinbase-pro');
import { BuySellPairs, ResponseCode, OrderBook, BuyOrSellString } from "./typing";
import { AuthenticatedClient, OrderParams } from "coinbase-pro";

// Don't know of a case where USD won't work, but btc as backup. Rates seem essentially identical
// For now will be assuming USD but could convert to prioritize different pairs
// const preferredTradingPairs = ["USD", "BTC"]
const preferredTradingPair = "USD"

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

const authedClient: AuthenticatedClient = new cbp.AuthenticatedClient(
    process.env.key,
    process.env.secret,
    process.env.passphrase,
    apiURI
);

const createLimitOrder = (price: string, amount: string, tradingPair: string, side: BuyOrSellString): OrderParams => { // same params for buy and sell
    return {
        type: "limit",
        side: side,
        price: price, // USD per BTC
        size: amount, // amount of BTC to buy
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

const createMarketOrder = (amount: string, tradingPair: string, side: BuyOrSellString): OrderParams => { // same params for buy and sell
    return {
        type: "market",
        side: side,
        funds: amount, // same as size
        size: amount, // amount of BTC to buy
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

export const placeOrder = async (isBuy: boolean, isLimit: boolean, price: string, amount: string, tradingPair: string): Promise<void> => {
    if (isBuy && isLimit) {
        const orderParams = createLimitOrder(price, amount, tradingPair, BuyOrSellString.Buy)
        authedClient.buy(orderParams) // returns a promise
    }
    else if (isBuy && !isLimit) {
        const orderParams = createMarketOrder(amount, tradingPair, BuyOrSellString.Buy)
        authedClient.buy(orderParams) // returns a promise
    }
    else if (!isBuy && isLimit) {
        const orderParams = createLimitOrder(price, amount, tradingPair, BuyOrSellString.Sell)
        authedClient.sell(orderParams) // returns a promise
    }
    else if (!isBuy && !isLimit) {
        const orderParams = createMarketOrder(amount, tradingPair, BuyOrSellString.Sell)
        authedClient.sell(orderParams) // returns a promise
    }
}

export const cancelAllOrders = async (): Promise<string[]> => {
    return authedClient.cancelAllOrders(); // returns a list of the ids of open orders that were successfully cancelled
}

export const cancelSingleOrder = async (orderId: string): Promise<string[]> => {
    authedClient.cancelOrder()
}

// trading pair is a string like BTC-USD. Depth caps at 3 (unaggrated orders). 2 is aggregated, 1 is just best
export const getOrderBook = async (tradingPair: string, depth: number): Promise<OrderBook> => {
    return await authedClient.getProductOrderBook(tradingPair, { level: depth })
        .catch(err => {
            console.error(err)
        })
}

export const getBestCurrentPriceFromOrderBook = async (orderBook: OrderBook): Promise<number> => {
    // const bestPrice = orderBook["asks"][1][0]
    // more complicated decisions can be made if the order book depth is also used

    return orderBook["asks"][1][0];
}

export const getCurrentPriceWithDepthOf20k = async (orderBook: OrderBook): Promise<number> => {
    const orderBookVolume = 0;
    while (orderBookVolume < 20000)
        return orderBook["asks"][1][0];
}

// need to determine which trading pairs are available
export const getTradingPairs = async (baseCoin: string, tradingPair: string): Promise<BuySellPairs> => {
    // getProducts returns the full list of trading pairs
    const allPairs = await authedClient.getProducts()
        .catch(err => {
            console.error(err)
        });

    let sellPairs = allPairs.filter((pair) => pair["base_currency"] == baseCoin && pair["quote_currency"] == tradingPair);
    let buyPairs = allPairs.filter((pair) => pair["quote_currency"] == baseCoin && pair["base_currency"] == tradingPair);
    buyPairs = buyPairs.map(pair => {
        return {
            "id": pair.id,
            "base_currency": pair.base_currency,
            "quote_currency": pair.quote_currency
        }
    })
    sellPairs = sellPairs.map(pair => {
        return {
            "id": pair.id,
            "base_currency": pair.base_currency,
            "quote_currency": pair.quote_currency
        }
    })

    return {
        "buyPairs": buyPairs,
        "sellPairs": sellPairs
    }
}

export const handleTrigger = async (newListing: string): Promise<ResponseCode> => {

    const tradingPairs = getTradingPairs(newListing, preferredTradingPair)

    return ResponseCode.SUCCESS;
}

/*
    order book calls return at depth 1
    {
    "sequence": "3",
    "bids": [
        [ price, size, num-orders ],
    ],
    "asks": [
        [ price, size, num-orders ],
    ]
}

*/

// // Get the order book at a specific level of detail.
// publicClient.getProductOrderBook('LTC-USD', { level: 3 }, callback);

// Get Products allows you to see valid pairs; i.e. may not have USD support (but generally should)
// https://docs.pro.coinbase.com/#products





// Example from site for buy & sell
// // Buy 1 BTC @ 100 USD
// const buyParams = {
//     price: '100.00', // USD
//     size: '1', // BTC
//     product_id: 'BTC-USD',
//   };
//   authedClient.buy(buyParams, callback);

//   // Sell 1 BTC @ 110 USD
//   const sellParams = {
//     price: '110.00', // USD
//     size: '1', // BTC
//     product_id: 'BTC-USD',
//   };
//   authedClient.sell(sellParams, callback);


// example for close pos
// const params = {
//     repay_only: false,
//   };
//   authedClient.closePosition(params, callback);


// Getting prices 
// https://docs.pro.coinbase.com/#get-product-order-book
// Get the order book at the default level of detail.
// publicClient.getProductOrderBook('BTC-USD', callback);



// client sdk https://github.com/coinbase/coinbase-pro-node
// Listing data https://docs.google.com/spreadsheets/d/1y0SE1DtbaUltUHtGBzBgz9BXgzKGvk5SF1xjjK52grw/edit#gid=0


// fetch the price of asset for cases where placing limit order
// support market order
// send telegram alert when order is placed (optional)
// send alert when order is complete (optional but impt imo)
// checks should be via cron or similar 


// Order placing should go this way:
// Coinbase pro listing identified, nothing should be done
// coinbase all listing ided, should place order. Can check if it makes sense to do things early

// https://docs.pro.coinbase.com/#place-a-new-order