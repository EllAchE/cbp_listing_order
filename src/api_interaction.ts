const cbp = require('coinbase-pro');
import { BuySellPairs, OrderBook, BuyOrSellString, TradingPair } from "./typing";
import { AuthenticatedClient, OrderParams, OrderResult } from "coinbase-pro";
import { logger } from "./logger";

// Don't know of a case where USD won't work, but btc as backup. Rates seem essentially identical
// For now will be assuming USD but could convert to prioritize different pairs

//const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';
const apiURI = 'https://api.pro.coinbase.com';

const authedClient: AuthenticatedClient = new cbp.AuthenticatedClient( // initialize your ordering client
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

export const placeLimitOrder = async (isBuy: boolean, price: string, amount: string, tradingPair: string): Promise<OrderResult> => {
    if (isBuy) {
        const orderParams = createLimitOrder(price, amount, tradingPair, BuyOrSellString.Buy)
        return authedClient.buy(orderParams) // returns a promise
    }
    else {
        const orderParams = createLimitOrder(price, amount, tradingPair, BuyOrSellString.Sell)
        return authedClient.sell(orderParams) // returns a promise
    }
}

export const placeMarketOrder = async (isBuy: boolean, amount: string, tradingPair: string): Promise<OrderResult> => {
    if (isBuy) {
        const orderParams = createMarketOrder(amount, tradingPair, BuyOrSellString.Buy)
        return authedClient.buy(orderParams) // returns a promise
    }
    else {
        const orderParams = createMarketOrder(amount, tradingPair, BuyOrSellString.Sell)
        return authedClient.sell(orderParams) // returns a promise
    }
}

export const closePosition = async (productId: string): Promise<OrderResult> => {
    return authedClient.closePosition({
        product_id: productId // this needs to be tested, the docs weren't clear
    })
}

export const cancelAllOrders = async (productId: string): Promise<string[]> => {
    return authedClient.cancelAllOrders({ product_id: productId }); // returns a list of the ids of open orders that were successfully cancelled
}

export const cancelSingleOrder = async (orderId: string): Promise<string[]> => {
    return authedClient.cancelOrder(orderId); // requires ID to cancel
}

// trading pair is a string like BTC-USD. Depth caps at 3 (unaggregated orders). 2 is aggregated, 1 is just best
export const getOrderBook = async (tradingPair: string, depth: number): Promise<OrderBook> => {
    return await authedClient.getProductOrderBook(tradingPair, { level: depth })
        .catch(err => {
            logger.error(err)
        })
}

export const getBestCurrentPriceFromOrderBook = async (orderBook: OrderBook): Promise<number> => {
    // const bestPrice = orderBook["asks"][1][0]
    // more complicated decisions can be made if the order book depth is also used

    return orderBook["asks"][1][0];
}

// export const getCurrentPriceWithDepthOf20k = async (orderBook: OrderBook): Promise<number|undefined> => {
//     const orderBookVolume = 0;
//     while (orderBookVolume < 20000)
//         return orderBook["asks"][1][0];
// }

// need to determine which trading pairs are available
export const getTradingPairs = async (baseCoin: string, quoteCoin: string): Promise<BuySellPairs> => {
    // getProducts returns the full list of trading pairs
    const allPairs = await authedClient.getProducts()
        .catch(err => {
            logger.error(err)
        });

    if (allPairs) {
        let sellPairs = allPairs.filter((pair) => pair["base_currency"] == baseCoin && pair["quote_currency"] == quoteCoin);
        let buyPairs = allPairs.filter((pair) => pair["quote_currency"] == baseCoin && pair["base_currency"] == quoteCoin);

        let buyPairsShort: TradingPair[] = buyPairs.map(pair => {
            return {
                "id": pair.id,
                "base_currency": pair.base_currency,
                "quote_currency": pair.quote_currency
            }
        })
        let sellPairsShort: TradingPair[] = sellPairs.map(pair => {
            return {
                "id": pair.id,
                "base_currency": pair.base_currency,
                "quote_currency": pair.quote_currency
            }
        })

        return {
            "buyPairs": buyPairsShort,
            "sellPairs": sellPairsShort
        }
    }
    throw new Error(`no pair between base ${baseCoin} and quote ${quoteCoin} exists`)
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