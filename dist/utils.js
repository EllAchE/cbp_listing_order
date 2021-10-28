"use strict";
exports.__esModule = true;
exports.marketOrderAmount = exports.createBaseLoggingResponse = exports.getTradingPairsFromTitle = void 0;
var logger_1 = require("./logger");
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
var createBaseLoggingResponse = function () {
    return {
        buyOrderResult: undefined,
        sellOrderResult: undefined,
        title: "TITLE NOT SET ON LOGGING RESPONSE",
        titleChanged: true,
        error: undefined,
        time: new Date().toLocaleDateString()
    };
};
exports.createBaseLoggingResponse = createBaseLoggingResponse;
exports.marketOrderAmount = '100'; // must be a string for api methods
//# sourceMappingURL=utils.js.map