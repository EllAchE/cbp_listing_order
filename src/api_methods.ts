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
const createLimitBuyOrder = (price, amount, tradingPair) => {
    return {
        price: price, // USD
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

const createLimitSellOrder = (price, amount, tradingPair) => {
    return {
        price: price, // USD
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

const createMarketBuyOrder = (price, amount, tradingPair) => {
    return {
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
}

const createMarketSellOrder = (price, amount, tradingPair) => {
    return {
        size: amount, // BTC
        product_id: tradingPair, // first item is what's being bought, second item is what's being spent
    };
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

// // Get the order book at a specific level of detail.
// publicClient.getProductOrderBook('LTC-USD', { level: 3 }, callback);

// Get Products allows you to see valid pairs; i.e. may not have USD support (but generally should)
// https://docs.pro.coinbase.com/#products