"use strict";
exports.__esModule = true;
exports.logger = void 0;
var winston_1 = require("winston");
exports.logger = winston_1.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.simple()),
    transports: [
        new winston_1.transports.Console, // by default logs won't be saved
        // new transports.File({
        //     filename: './test.log'
        // })
    ]
});
//# sourceMappingURL=logger.js.map