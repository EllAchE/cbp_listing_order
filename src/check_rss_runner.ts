import { cronUpdate } from "./check_rss";
import { logger } from "./logger";

logger.info('Launching coinbase monitoring cronjob', new Date().toLocaleDateString())
cronUpdate.start() // launch the cron
