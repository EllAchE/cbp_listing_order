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
exports.updateLastTitle = exports.getLastTitle = exports.initializeLastTitle = exports.marketOrderAmount = exports.checkIfTitleIsAllListing = exports.getTradingPairsFromTitle = exports.createBaseLoggingResponse = void 0;
var check_rss_1 = require("./check_rss");
var logger_1 = require("./logger");
var createBaseLoggingResponse = function (_a) {
    var _b = _a.title, title = _b === void 0 ? "TITLE NOT SET ON LOGGING RESPONSE" : _b, buyOrderResult = _a.buyOrderResult, sellOrderResult = _a.sellOrderResult, error = _a.error, _c = _a.titleChanged, titleChanged = _c === void 0 ? true : _c;
    return {
        buyOrderResult: buyOrderResult,
        sellOrderResult: sellOrderResult,
        title: title,
        titleChanged: titleChanged,
        error: error,
        time: new Date().toLocaleDateString()
    };
};
exports.createBaseLoggingResponse = createBaseLoggingResponse;
var getTradingPairsFromTitle = function (titleString) {
    var cbpPairReg = /(?<=\()(\w{1,10})(?=\))/gi;
    var matchArray = titleString.match(cbpPairReg);
    var mappedArray = matchArray === null || matchArray === void 0 ? void 0 : matchArray.map(function (pair) { return "USD-" + pair; });
    if (mappedArray)
        return mappedArray;
    else {
        logger_1.logger.warn("extracted regex value didn't pass the next layer of validation");
        logger_1.logger.warn("the title was " + titleString);
        return [];
    }
};
exports.getTradingPairsFromTitle = getTradingPairsFromTitle;
var checkIfTitleIsAllListing = function (title) {
    var regPatternAll = new RegExp(/(is|are) (now available|launching) on Coinbase$/i); // for  4 different syntax cases item listing, and anchor at end to avoid cbp match
    // const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/) // only runs for regular listings, can't buy on cbp when they list
    return regPatternAll.test(title);
};
exports.checkIfTitleIsAllListing = checkIfTitleIsAllListing;
exports.marketOrderAmount = '100'; // must be a string for api methods
var lastTitle;
var initializeLastTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var lastTitleTest;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, check_rss_1.getBlogTitle()];
            case 1:
                lastTitleTest = _a.sent();
                if (!lastTitleTest)
                    throw Error("failed to intialize title");
                else {
                    lastTitle = lastTitleTest;
                }
                return [2 /*return*/];
        }
    });
}); };
exports.initializeLastTitle = initializeLastTitle;
var getLastTitle = function () {
    return lastTitle;
};
exports.getLastTitle = getLastTitle;
var updateLastTitle = function (title) {
    lastTitle = title;
};
exports.updateLastTitle = updateLastTitle;
//# sourceMappingURL=utils.js.map