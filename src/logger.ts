import { createLogger, format, Logger, transports } from "winston";

export const logger: Logger = createLogger(
    {
        format: format.combine(
            format.timestamp(),
            format.simple()
        ),
        transports: [
            new transports.Console,
            new transports.File({
                filename: './logs.log'
            })
        ]
    }
)