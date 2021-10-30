import { cronUpdate } from "./check_rss";
import { logger } from "./logger";

if (!process.env.key || !process.env.passphrase || !process.env.secret) logger.error('missing secret, passphrase or key. Exiting execution')
else {
    logger.info('Launching coinbase monitoring cronjob')
    cronUpdate.start() // launch the cron
}
