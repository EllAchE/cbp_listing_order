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
exports.getBlogTitle = exports.cronUpdate = void 0;
var cron_1 = require("cron");
var utils_1 = require("./utils");
var logger_1 = require("./logger");
var custom_methods_1 = require("./custom_methods");
//const fs = require('fs');
//const got = require('got');
var rss = require('rss-parser');
var cronString = "0 * * * * *"; // run every minute, all hours except midnight-7am. Need to check TZ // also could probably ignore saturdays as possible listing date
exports.cronUpdate = new cron_1.CronJob(cronString, function () {
    logger_1.logger.info("Coinbase listing cron executed at " + new Date().toLocaleString());
    try {
        // const lastTitle = fs.readJsonSync('dist/json/last_title.json').title; save title if wanted
        checkFeed().then(function (logResponses) {
            logResponses.forEach(function (logResponse) {
                logger_1.logger.info(JSON.stringify(logResponse));
            });
        })["catch"](function (err) { return logger_1.logger.error(err); });
    }
    catch (err) {
        logger_1.logger.error("cron error", err); // promise return means this catch block shouldn't be executed
    }
}, null, false);
var getBlogTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var parser, feed, title, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                parser = new rss();
                return [4 /*yield*/, parser.parseURL('https://blog.coinbase.com/feed')];
            case 1:
                feed = _a.sent();
                title = feed.items[0].title;
                logger_1.logger.info("title parsed from rss feed " + title);
                return [2 /*return*/, title]; // other option is content:encoded
            case 2:
                err_1 = _a.sent();
                logger_1.logger.error("errror retrieving feed results", err_1);
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getBlogTitle = getBlogTitle;
var checkFeed = function () { return __awaiter(void 0, void 0, void 0, function () {
    var title, lastTitle, logResponse, tradingPairArray, logResponse, logResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getBlogTitle()];
            case 1:
                title = _a.sent();
                lastTitle = utils_1.getLastTitle();
                if (!title) {
                    logger_1.logger.error("errror retrieving title from feed results");
                    logResponse = utils_1.createBaseLoggingResponse({ titleChanged: false, error: "error retrieving title from feed results", buyOrderResult: undefined, sellOrderResult: undefined });
                    return [2 /*return*/, [logResponse]];
                }
                else if (title != lastTitle) { // execute orders here
                    logger_1.logger.info("title changed! It used to be " + lastTitle + ", now it is " + title);
                    utils_1.updateLastTitle(title);
                    tradingPairArray = void 0;
                    if (utils_1.checkIfTitleIsAllListing(title)) {
                        tradingPairArray = utils_1.getTradingPairsFromTitle(title);
                        logger_1.logger.info("retrieved trading pair from new title, value is " + tradingPairArray);
                        return [2 /*return*/, custom_methods_1.executeTrades(tradingPairArray, lastTitle)];
                    }
                    else {
                        logger_1.logger.info("regex didn't find a match on the title, or somehow returned null. Title was " + title);
                        logResponse = utils_1.createBaseLoggingResponse({ title: lastTitle, error: "regex retrieval didn't find a match, or somehow returned null", buyOrderResult: undefined, sellOrderResult: undefined });
                        return [2 /*return*/, [logResponse]];
                    }
                }
                else { // can have more checks here if needed
                    logResponse = utils_1.createBaseLoggingResponse({ title: lastTitle, titleChanged: false, error: undefined, buyOrderResult: undefined, sellOrderResult: undefined });
                    return [2 /*return*/, [logResponse]];
                }
                return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!process.env.key || !process.env.passphrase || !process.env.secret)) return [3 /*break*/, 1];
                logger_1.logger.error('missing secret, passphrase or key. Exiting execution');
                return [3 /*break*/, 3];
            case 1:
                logger_1.logger.info("initalizing title");
                return [4 /*yield*/, utils_1.initializeLastTitle()];
            case 2:
                _a.sent();
                logger_1.logger.info("title set to " + utils_1.getLastTitle());
                _a.label = 3;
            case 3:
                logger_1.logger.info('Launching coinbase monitoring cronjob');
                exports.cronUpdate.start(); // launch the cron
                return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=check_rss.js.map