"use strict";
exports.__esModule = true;
exports.getTradingPairFromRegResult = void 0;
var getTradingPairFromRegResult = function (regArray) {
    var firstMatch = regArray[0];
    var cbpPairReg = /.{5}/i;
    if (cbpPairReg.test(firstMatch)) {
        return "USD-" + firstMatch; // Assuming everything has a USD pair on cbp, seems to be
    }
    return undefined;
};
exports.getTradingPairFromRegResult = getTradingPairFromRegResult;
//# sourceMappingURL=utils.js.map