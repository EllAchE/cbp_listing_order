"use strict";
exports.__esModule = true;
var check_rss_1 = require("./check_rss");
var logger_1 = require("./logger");
logger_1.logger.info('Launching coinbase monitoring cronjob', new Date().toLocaleDateString());
check_rss_1.cronUpdate.start(); // launch the cron
//# sourceMappingURL=check_rss_runner.js.map