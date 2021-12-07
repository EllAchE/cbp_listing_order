"use strict";
// Assumes that an immediate purchase was made upon listing on all
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
exports.sellLogic = void 0;
var api_interaction_1 = require("./api_interaction");
var logger_1 = require("./logger");
var sellLogic = function (buyOrderId, tradingPair) { return __awaiter(void 0, void 0, void 0, function () {
    var orderResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // wait for 1 min, then immediately set a stop limit for the price at the time of the listing
                // sell 2 min after receiving an order response
                // sell after 5 min no matter what
                // Need to revisit this logic. 
                /*
                    Options are: Stop Limit, Limit, Market after time, constantly rising limit (trailing limit)
                */
                logger_1.logger.info("attempting to sell value of settled order, will first wait for 180 seconds");
                sleep(320); // poor implementation of await, but setTimeout return type is weird
                return [4 /*yield*/, api_interaction_1.getPlacedOrder(buyOrderId)]; // order should have been placed if market and waiting for 3 minutes
            case 1:
                orderResult = _a.sent() // order should have been placed if market and waiting for 3 minutes
                ;
                logger_1.logger.info("Waited for 180 seconds. Attempting to sell.");
                return [4 /*yield*/, api_interaction_1.placeMarketOrder(false, orderResult.filled_size, tradingPair)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.sellLogic = sellLogic;
function sleep(seconds) {
    var e = new Date().getTime() + (seconds * 1000);
    while (new Date().getTime() <= e) { }
}
//# sourceMappingURL=listing_sell_logic.js.map