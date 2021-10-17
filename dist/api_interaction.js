"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getTradingPairs = exports.getBestCurrentPriceFromOrderBook = exports.getOrderBook = exports.cancelSingleOrder = exports.cancelAllOrders = exports.placeMarketOrder = exports.placeLimitOrder = void 0;
var cbp = require('coinbase-pro');
var typing_1 = require("./typing");
// Don't know of a case where USD won't work, but btc as backup. Rates seem essentially identical
// For now will be assuming USD but could convert to prioritize different pairs
var apiURI = 'https://api.pro.coinbase.com';
//const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';
var authedClient = new cbp.AuthenticatedClient(process.env.key, process.env.secret, process.env.passphrase, apiURI);
var createLimitOrder = function (price, amount, tradingPair, side) {
    return {
        type: "limit",
        side: side,
        price: price,
        size: amount,
        product_id: tradingPair
    };
};
var createMarketOrder = function (amount, tradingPair, side) {
    return {
        type: "market",
        side: side,
        funds: amount,
        size: amount,
        product_id: tradingPair
    };
};
var placeLimitOrder = function (isBuy, price, amount, tradingPair) { return __awaiter(void 0, void 0, void 0, function () {
    var orderParams, orderParams;
    return __generator(this, function (_a) {
        if (isBuy) {
            orderParams = createLimitOrder(price, amount, tradingPair, typing_1.BuyOrSellString.Buy);
            return [2 /*return*/, authedClient.buy(orderParams)]; // returns a promise
        }
        else {
            orderParams = createLimitOrder(price, amount, tradingPair, typing_1.BuyOrSellString.Sell);
            return [2 /*return*/, authedClient.sell(orderParams)]; // returns a promise
        }
        return [2 /*return*/];
    });
}); };
exports.placeLimitOrder = placeLimitOrder;
var placeMarketOrder = function (isBuy, amount, tradingPair) { return __awaiter(void 0, void 0, void 0, function () {
    var orderParams, orderParams;
    return __generator(this, function (_a) {
        if (isBuy) {
            orderParams = createMarketOrder(amount, tradingPair, typing_1.BuyOrSellString.Buy);
            return [2 /*return*/, authedClient.buy(orderParams)]; // returns a promise
        }
        else {
            orderParams = createMarketOrder(amount, tradingPair, typing_1.BuyOrSellString.Sell);
            return [2 /*return*/, authedClient.sell(orderParams)]; // returns a promise
        }
        return [2 /*return*/];
    });
}); };
exports.placeMarketOrder = placeMarketOrder;
var cancelAllOrders = function (productId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, authedClient.cancelAllOrders({ product_id: productId })]; // returns a list of the ids of open orders that were successfully cancelled
    });
}); };
exports.cancelAllOrders = cancelAllOrders;
var cancelSingleOrder = function (orderId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, authedClient.cancelOrder(orderId)]; // requires ID to cancel
    });
}); };
exports.cancelSingleOrder = cancelSingleOrder;
// trading pair is a string like BTC-USD. Depth caps at 3 (unaggrated orders). 2 is aggregated, 1 is just best
var getOrderBook = function (tradingPair, depth) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authedClient.getProductOrderBook(tradingPair, { level: depth })["catch"](function (err) {
                    console.error(err);
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getOrderBook = getOrderBook;
var getBestCurrentPriceFromOrderBook = function (orderBook) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // const bestPrice = orderBook["asks"][1][0]
        // more complicated decisions can be made if the order book depth is also used
        return [2 /*return*/, orderBook["asks"][1][0]];
    });
}); };
exports.getBestCurrentPriceFromOrderBook = getBestCurrentPriceFromOrderBook;
// export const getCurrentPriceWithDepthOf20k = async (orderBook: OrderBook): Promise<number|undefined> => {
//     const orderBookVolume = 0;
//     while (orderBookVolume < 20000)
//         return orderBook["asks"][1][0];
// }
// need to determine which trading pairs are available
var getTradingPairs = function (baseCoin, quoteCoin) { return __awaiter(void 0, void 0, void 0, function () {
    var allPairs, sellPairs, buyPairs, buyPairsShort, sellPairsShort;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, authedClient.getProducts()["catch"](function (err) {
                    console.error(err);
                })];
            case 1:
                allPairs = _a.sent();
                if (allPairs) {
                    sellPairs = allPairs.filter(function (pair) { return pair["base_currency"] == baseCoin && pair["quote_currency"] == quoteCoin; });
                    buyPairs = allPairs.filter(function (pair) { return pair["quote_currency"] == baseCoin && pair["base_currency"] == quoteCoin; });
                    buyPairsShort = buyPairs.map(function (pair) {
                        return {
                            "id": pair.id,
                            "base_currency": pair.base_currency,
                            "quote_currency": pair.quote_currency
                        };
                    });
                    sellPairsShort = sellPairs.map(function (pair) {
                        return {
                            "id": pair.id,
                            "base_currency": pair.base_currency,
                            "quote_currency": pair.quote_currency
                        };
                    });
                    return [2 /*return*/, {
                            "buyPairs": buyPairsShort,
                            "sellPairs": sellPairsShort
                        }];
                }
                throw new Error("no pair between base " + baseCoin + " and quote " + quoteCoin + " exists");
        }
    });
}); };
exports.getTradingPairs = getTradingPairs;
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
//# sourceMappingURL=api_interaction.js.map