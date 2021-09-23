const cbp = require('coinbase-pro');

// client sdk https://github.com/coinbase/coinbase-pro-node
// Listing data https://docs.google.com/spreadsheets/d/1y0SE1DtbaUltUHtGBzBgz9BXgzKGvk5SF1xjjK52grw/edit#gid=0


// fetch the price of asset for cases where placing limit order
// support market order
// send telegram alert when order is placed (optional)
// send alert when order is complete (optional but impt imo)
// checks should be via cron or similar 


const key = 'your_api_key';
const secret = 'your_b64_secret';
const passphrase = 'your_passphrase';

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

const authedClient = new cbp.AuthenticatedClient(
    key,
    secret,
    passphrase,
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

// Example from site
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