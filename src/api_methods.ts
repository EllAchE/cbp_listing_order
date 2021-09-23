const cbp = require('coinbase-pro');

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


const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

const authedClient = new cbp.AuthenticatedClient(
    process.env.key,
    process.env.secret,
    process.env.passphrase,
    apiURI
);

// https://docs.pro.coinbase.com/#place-a-new-order

// same params for buy and sell
const createLimitOrder = (price: number, amount: number, tradingPair: string) => {
    return {
        price: price, // USD
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

// same params for buy and sell
const createMarketOrder = (amount, tradingPair) => {
    return {
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

export const placeOrder = async (isBuy: boolean, isLimit: boolean, price: number, amount: number, tradingPair: string) => {
    if (isBuy && isLimit) {
        const orderParams = createLimitOrder(price, amount, tradingPair)
        //authedClient.buy(orderParams) // returns a promise
    }
    else if (isBuy && !isLimit) {
        const orderParams = createMarketOrder(amount, tradingPair)
        //authedClient.buy(orderParams) // returns a promise
    }
    else if (!isBuy && isLimit) {
        const orderParams = createLimitOrder(price, amount, tradingPair)
        //authedClient.sell(orderParams) // returns a promise
    }
    else if (!isBuy && !isLimit) {
        const orderParams = createMarketOrder(amount, tradingPair)
        //authedClient.sell(orderParams) // returns a promise
    }
}

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

export const getBestCurrentPrice = async (tradingPair: string, depth: number): Promise<number> => {
    const orderBook = await authedClient.getProductOrderBook(tradingPair, { level: depth })
        .then()
        .catch(err => {
            console.error(err)
        })
    //const bestPrice = orderBook["asks"][1][0]
    // more complicated decisions can be made if the order book depth is also used

    return orderBook["asks"][1][0];
}

// need to determine which trading pairs are 
export const getTradingPairs = async (baseCoin: string, getBuyPairs: boolean): Promise<string[]> => {
    // getProducts returns the full list of trading pairs
    const allPairs = authedClient.getProducts()
        .then()
        .catch(err => {
            console.error(err)
        });

    //const buyPairs = allPairs.filter((pair) => pair["quote_currency"] == baseCoin)
    //const sellPairs = allPairs.filter((pair) => pair["base_currency"] == baseCoin)

    if (getBuyPairs) return allPairs.filter((pair) => pair["quote_currency"] == baseCoin);

    return allPairs.filter((pair) => pair["base_currency"] == baseCoin);
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