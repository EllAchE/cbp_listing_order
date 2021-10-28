"use strict";
exports.__esModule = true;
exports.marketOrderAmount = exports.checkIfTitleIsAllListing = exports.getTradingPairsFromTitle = exports.createBaseLoggingResponse = void 0;
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
    var regPatternAllSingle = new RegExp(/(?<=\()(\w{1,10})(?=\) is now available on Coinbase)/i); // for singular item listing
    var regPatternAllMultiple = new RegExp(/(?<=\()(\w{1,10})(?=\) are now available on Coinbase)/i); // for multiple item listing
    // const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/) // only runs for regular listings, can't buy on cbp when they list
    return regPatternAllMultiple.test(title) || regPatternAllSingle.test(title);
};
exports.checkIfTitleIsAllListing = checkIfTitleIsAllListing;
exports.marketOrderAmount = '100'; // must be a string for api methods
//# sourceMappingURL=utils.js.map