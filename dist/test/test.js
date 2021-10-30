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
var check_rss_1 = require("../check_rss");
var utils_1 = require("../utils");
require('jest');
var assert = require('assert');
// todo add testing for multiple items being listed at the same time
var coinbaseTitleSingleListing = "Assemble Protocol (ASM) is now available on Coinbase";
var coinbaseTitleMultipleListing = "ARPA Chain (ARPA) and Perpetual Protocol (PERP) are now available on Coinbase";
var coinbaseTitleProSingleListing = "Assemble Protocol (ASM) is launching on Coinbase Pro";
var coinbaseTitleProMultipleListing = "ARPA Chain (ARPA), Bounce (AUCTION) and Perpetual Protocol (PERP) are launching on Coinbase Pro";
var coinbaseTitleNoParenthesis = "ARPA Chain ARPA), Bounce (AUCTION and Perpetual Protocol ( PERP) are launching on Coinbase Pro";
describe('Logging responses should work as expected', function () {
    it('Should create base logging response', function () {
    });
    it('Should create logging response with passed parameters', function () {
    });
});
describe('Trading pair extraction from titles should work as expected', function () {
    it('Should get single listing from title', function () {
        var tradingPairs = utils_1.getTradingPairsFromTitle(coinbaseTitleSingleListing);
        expect(["USD-ASM"]).toEqual(tradingPairs);
    });
    it('Should get multiple listing from title', function () {
        var tradingPairs = utils_1.getTradingPairsFromTitle(coinbaseTitleMultipleListing);
        expect(["USD-ARPA", "USD-PERP"]).toEqual(tradingPairs);
    });
    it('Should get no match from title without match', function () {
        assert.equal(0, utils_1.getTradingPairsFromTitle(coinbaseTitleNoParenthesis));
        assert.equal(0, utils_1.getTradingPairsFromTitle("").length);
    });
});
describe('Should determine if title is an all listing', function () {
    it('Should match on title with singular listing', function () {
        assert.equal(true, utils_1.checkIfTitleIsAllListing(coinbaseTitleSingleListing));
    });
    it('Should match on title with multiple listing', function () {
        assert.equal(true, utils_1.checkIfTitleIsAllListing(coinbaseTitleMultipleListing));
    });
    it('Should fail to match on title without listing', function () {
        assert.equal(false, utils_1.checkIfTitleIsAllListing(coinbaseTitleProMultipleListing));
        assert.equal(false, utils_1.checkIfTitleIsAllListing(coinbaseTitleProSingleListing));
        assert.equal(false, utils_1.checkIfTitleIsAllListing(""));
    });
});
describe('Should get latest blog title', function () {
    it('Should get latest blog title', function () { return __awaiter(void 0, void 0, void 0, function () {
        var title;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, check_rss_1.getBlogTitle()];
                case 1:
                    title = _a.sent();
                    console.log(title);
                    assert.equal("string", typeof title); // this test is bad, needs to look for nonempty
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=test.js.map