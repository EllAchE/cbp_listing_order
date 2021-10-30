"use strict";
exports.__esModule = true;
var check_rss_1 = require("./check_rss");
var logger_1 = require("./logger");
if (!process.env.key || !process.env.passphrase || !process.env.secret)
    logger_1.logger.error('missing secret, passphrase or key. Exiting execution');
else {
    logger_1.logger.info('Launching coinbase monitoring cronjob');
    check_rss_1.cronUpdate.start(); // launch the cron
}
//# sourceMappingURL=check_rss_runner.js.map