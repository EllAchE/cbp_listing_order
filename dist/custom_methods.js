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
exports.executeTrades = exports.initialPurchase = void 0;
var api_interaction_1 = require("./api_interaction");
var listing_sell_logic_1 = require("./listing_sell_logic");
var logger_1 = require("./logger");
var utils_1 = require("./utils");
// export const handleTrigger = async (newListing: string, preferredTradingPair: string): Promise<ResponseCode> => {
//     const tradingPairs = getTradingPairs(newListing, preferredTradingPair)
//     return ResponseCode.SUCCESS;
// }
function initialPurchase(tradingPair, marketOrderAmount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api_interaction_1.placeMarketOrder(true, marketOrderAmount, tradingPair)];
                case 1: return [2 /*return*/, _a.sent()]; // naive implementation, immediate market order of specified amount
            }
        });
    });
}
exports.initialPurchase = initialPurchase;
function executeTrades(tradingPairArray, lastTitle) {
    var _this = this;
    var arr = [];
    tradingPairArray.forEach(function (pair) {
        arr.push(initialPurchase(pair, utils_1.marketOrderAmount).then(function (buyOrderResult) { return __awaiter(_this, void 0, void 0, function () {
            var sellOrderResult, logResponse, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger_1.logger.info("received order result: " + buyOrderResult);
                        // todo this needs better logic to wait if trade doesn't instantly settle
                        if (!buyOrderResult.settled)
                            logger_1.logger.warn('trade hasn\'t settled, attempting to sell regardless (even though buy was a market), so expect an error.');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, listing_sell_logic_1.sellLogic(buyOrderResult.executed_value, buyOrderResult.product_id)];
                    case 2:
                        sellOrderResult = _a.sent();
                        logResponse = utils_1.createBaseLoggingResponse({ title: lastTitle, buyOrderResult: buyOrderResult, sellOrderResult: sellOrderResult, error: undefined });
                        logger_1.logger.info(logResponse);
                        return [2 /*return*/, logResponse];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, utils_1.createBaseLoggingResponse({ title: lastTitle, buyOrderResult: buyOrderResult, sellOrderResult: undefined, error: err_1 })];
                    case 4: return [2 /*return*/];
                }
            });
        }); })["catch"](function (err) {
            logger_1.logger.error('error with buy order', err);
            return utils_1.createBaseLoggingResponse({ title: lastTitle, buyOrderResult: undefined, sellOrderResult: undefined, error: err });
        }));
    });
    var returnArr = []; // this is done just to return a logging object
    arr.forEach(function (elem) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = returnArr).push;
                    return [4 /*yield*/, elem];
                case 1:
                    _b.apply(_a, [_c.sent()]); // yhid 
                    return [2 /*return*/];
            }
        });
    }); });
    return returnArr;
}
exports.executeTrades = executeTrades;
//# sourceMappingURL=custom_methods.js.map