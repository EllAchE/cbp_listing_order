"use strict";
exports.__esModule = true;
exports.getAuthedClient = exports.initaliazeAuthedClient = void 0;
var coinbase_pro_1 = require("coinbase-pro");
var logger_1 = require("./logger");
var authedClient;
var initaliazeAuthedClient = function () {
    //const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';
    var apiURI = 'https://api.pro.coinbase.com';
    logger_1.logger.info("initializing authed client");
    if (process.env.key && process.env.secret && process.env.passphrase) {
        logger_1.logger.info("process vals");
        logger_1.logger.info("found values for key, secret and passphrase");
        authedClient = new coinbase_pro_1.AuthenticatedClient(// initialize your ordering client
        process.env.key, process.env.secret, process.env.passphrase, apiURI);
    }
    else {
        throw Error('Client key, secret and passphrase were malformed or not properly retrieved.');
    }
};
exports.initaliazeAuthedClient = initaliazeAuthedClient;
var getAuthedClient = function () {
    return authedClient;
};
exports.getAuthedClient = getAuthedClient;
//# sourceMappingURL=client.js.map