"use strict";
exports.__esModule = true;
exports.marketOrderAmount = exports.getTradingPairFromRegResult = void 0;
var logger_1 = require("./logger");
var getTradingPairFromRegResult = function (regArray) {
    var firstMatch = regArray[0];
    var cbpPairReg = /.{5}/i;
    if (cbpPairReg.test(firstMatch)) {
        return "USD-" + firstMatch; // Assuming everything has a USD pair on cbp, seems to be
    }
    else {
        logger_1.logger.warn("extracted regex value didn't pass the next layer of validation");
        logger_1.logger.warn("the matched value was " + firstMatch);
    }
    return undefined;
};
exports.getTradingPairFromRegResult = getTradingPairFromRegResult;
exports.marketOrderAmount = '100'; // must be a string for api methods
//# sourceMappingURL=utils.js.map