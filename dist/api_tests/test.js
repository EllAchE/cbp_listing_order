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
require('jest');
var api_interaction_1 = require("../api_interaction");
var client_1 = require("../client");
var listing_sell_logic_1 = require("../listing_sell_logic");
client_1.initaliazeAuthedClient(); // setup client before placing orders
// For this test suite you should check that the open limit orders exist, and that the market orders were actually placed
//export const placeLimitOrder = async (isBuy: boolean, price: string, amount: string, tradingPair: string): Promise<OrderResult> => {
describe('should place limit buy order', function () {
    it('Should place limit order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_interaction_1.placeLimitOrder(true, "0.01", "0.00002100", "BTC-USD")]; // should place a limit order to buy btc at $0.000001, so should (likely) never execute
                case 1:
                    orderResult = _a.sent() // should place a limit order to buy btc at $0.000001, so should (likely) never execute
                    ;
                    expect(orderResult).toHaveProperty("id");
                    expect(orderResult.product_id).toBe("BTC-USD");
                    expect(orderResult.filled_size).toBe("0");
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('should place limit sell order', function () {
    it('Should place limit order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var orderResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_interaction_1.placeLimitOrder(false, "9999999", "0.00002100", "BTC-USD")]; // should place a limit order to sell btc at $99999999999, so should (likely) never execute
                case 1:
                    orderResult = _a.sent() // should place a limit order to sell btc at $99999999999, so should (likely) never execute
                    ;
                    expect(orderResult).toHaveProperty("id");
                    expect(orderResult.product_id).toBe("BTC-USD");
                    expect(orderResult.filled_size).toBe("0");
                    return [2 /*return*/];
            }
        });
    }); });
});
// //export const placeMarketOrder = async (isBuy: boolean, amount: string, tradingPair: string): Promise<OrderResult> => {
describe('should place market buy order then sell equivalent amount', function () {
    it('Should place market buy order then sell executed amount. Proxies sell logic without the 180s delay', function () { return __awaiter(void 0, void 0, void 0, function () {
        var buyOrderResult, sellOrderResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_interaction_1.placeMarketOrder(true, "5", "ETH-USD")]; // place a market order to buy $5 of ETH at market price
                case 1:
                    buyOrderResult = _a.sent() // place a market order to buy $5 of ETH at market price
                    ;
                    expect(buyOrderResult).toHaveProperty("id");
                    expect(buyOrderResult.product_id).toBe("ETH-USD");
                    expect(buyOrderResult.size).toBe("5");
                    return [4 /*yield*/, api_interaction_1.placeMarketOrder(false, "0.00029000", "ETH-USD")]; // place a market order to sell purchased amount ETH at market price. Some loss from fees
                case 2:
                    sellOrderResult = _a.sent() // place a market order to sell purchased amount ETH at market price. Some loss from fees
                    ;
                    expect(sellOrderResult).toHaveProperty("id");
                    expect(sellOrderResult.product_id).toBe("ETH-USD");
                    expect(sellOrderResult.size).toBe("0.00029000");
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('should properly execute sell logic based on the result of a settled order', function () {
    it('should properly execute sell logic based on the result of a settled order', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ethMarketSellOrderId, ethMarketPair, sellOrderResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethMarketSellOrderId = "31a99ecf-4a31-4784-9598-66efa64f6cfa";
                    ethMarketPair = "ETH-USD";
                    return [4 /*yield*/, listing_sell_logic_1.sellLogic(ethMarketSellOrderId, ethMarketPair)];
                case 1:
                    sellOrderResult = _a.sent();
                    expect(sellOrderResult).toHaveProperty("id");
                    expect(sellOrderResult.product_id).toBe("ETH-USD");
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=test.js.map