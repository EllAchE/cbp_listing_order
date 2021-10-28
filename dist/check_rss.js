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
exports.cronUpdate = void 0;
var cron_1 = require("cron");
var custom_methods_1 = require("./custom_methods");
var listing_sell_logic_1 = require("./listing_sell_logic");
var utils_1 = require("./utils");
var logger_1 = require("./logger");
//const fs = require('fs');
var got = require('got');
var rss = require('rss-parser');
var marketOrderAmount = '100'; // must be a string for api methods
var cronString = "0 * 23,7-23 * * *";
// run every minute, all hours except midnight-7am. Need to check TZ
// also could probably ignore saturdays as possible listing date
var regPatternAll = new RegExp(/(?<=\()(\w{1,5})(?=\) is now available on Coinbase)/);
// const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/)
// only runs for regular listings, can't buy on cbp when they list
var lastTitle;
exports.cronUpdate = new cron_1.CronJob(cronString, function () {
    logger_1.logger.info("Coinbase listing cron executed at " + new Date().toLocaleString());
    try {
        // const lastTitle = fs.readJsonSync('dist/json/last_title.json').title; save title if wanted
        checkFeed(lastTitle).then(function (logResponse) {
            logger_1.logger.info(logResponse);
        })["catch"](function (err) { return logger_1.logger.error(err); });
    }
    catch (err) {
        logger_1.logger.error("cron error", err); // promise return means this catch block shouldn't be executed
    }
}, null, false);
var getTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, got('https://blog.coinbase.com/feed').then(function (response) {
                    var parser = new rss();
                    var content = parser.parseString(response.body);
                    return content.items[0]['title']; // other option is content:encoded
                })["catch"](function (err) {
                    logger_1.logger.error("errror retrieving feed results", err);
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var checkFeed = function (lastTitle) { return __awaiter(void 0, void 0, void 0, function () {
    var title, regResultAll, tradingPair, buyOrderResult, settledTrade, boughtTokenAmount, tradingPairReturn, sellOrderResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTitle()];
            case 1:
                title = _a.sent();
                if (!(title != lastTitle)) return [3 /*break*/, 9];
                lastTitle = title;
                regResultAll = regPatternAll.exec(title);
                if (!(!regResultAll || regResultAll.length < 1)) return [3 /*break*/, 2];
                return [2 /*return*/, {
                        "buyOrderResult": undefined,
                        "sellOrderResult": undefined,
                        "title": lastTitle,
                        "titleChanged": true,
                        "error": "regex retrieval didn't find a match, or somehow returned null",
                        "time": new Date().toLocaleDateString()
                    }];
            case 2:
                if (!(regResultAll && regResultAll.length === 1)) return [3 /*break*/, 7];
                tradingPair = utils_1.getTradingPairFromRegResult(regResultAll);
                logger_1.logger.info("retrieved trading pair from new title, value is " + tradingPair);
                if (!tradingPair) return [3 /*break*/, 5];
                return [4 /*yield*/, custom_methods_1.initialPurchase(tradingPair, marketOrderAmount)];
            case 3:
                buyOrderResult = _a.sent();
                logger_1.logger.info("received order result: " + buyOrderResult);
                settledTrade = buyOrderResult.settled;
                boughtTokenAmount = buyOrderResult.executed_value;
                tradingPairReturn = buyOrderResult.product_id;
                if (!settledTrade)
                    logger_1.logger.warn('trade hasn\'t settled, attempting to sell regardless (even though buy was a market, so expect an error.');
                return [4 /*yield*/, listing_sell_logic_1.sellLogic(boughtTokenAmount, tradingPairReturn)];
            case 4:
                sellOrderResult = _a.sent();
                return [2 /*return*/, {
                        "buyOrderResult": buyOrderResult,
                        "sellOrderResult": sellOrderResult,
                        "title": lastTitle,
                        "titleChanged": true,
                        "error": undefined,
                        "time": new Date().toLocaleDateString() // todo add try catch here and everywhere
                    }];
            case 5:
                logger_1.logger.warn('trading pair ended up undefined or had multiple matches');
                return [2 /*return*/, {
                        "buyOrderResult": undefined,
                        "sellOrderResult": undefined,
                        "title": lastTitle,
                        "titleChanged": true,
                        "error": 'trading pair ended up undefined',
                        "time": new Date().toLocaleDateString() // todo add try catch here and everywhere
                    }];
            case 6: return [3 /*break*/, 8];
            case 7: // can have more checks here if needed
            return [2 /*return*/, {
                    "buyOrderResult": undefined,
                    "sellOrderResult": undefined,
                    "title": lastTitle,
                    "titleChanged": true,
                    "error": "regex retrieval returned array with more than one element",
                    "time": new Date().toLocaleDateString()
                }];
            case 8: return [3 /*break*/, 10];
            case 9: return [2 /*return*/, {
                    "buyOrderResult": undefined,
                    "sellOrderResult": undefined,
                    "title": lastTitle,
                    "titleChanged": false,
                    "error": undefined,
                    "time": new Date().toLocaleDateString()
                }];
            case 10: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=check_rss.js.map