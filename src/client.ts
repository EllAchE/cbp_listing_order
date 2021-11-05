import { AuthenticatedClient } from "coinbase-pro";
import { logger } from "./logger";

let authedClient: AuthenticatedClient;

export const initaliazeAuthedClient = (): void => {
    //const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';
    const apiURI = 'https://api.pro.coinbase.com';

    logger.info(`initializing authed client`)
    if (process.env.key && process.env.secret && process.env.passphrase) {
        logger.info("process vals")
        logger.info(`found values for key, secret and passphrase`)
        authedClient = new AuthenticatedClient( // initialize your ordering client
            process.env.key,
            process.env.secret,
            process.env.passphrase,
            apiURI
        );
    }
    else {
        throw Error('Client key, secret and passphrase were malformed or not properly retrieved.')
    }
}

export const getAuthedClient = (): AuthenticatedClient => {
    return authedClient;
}