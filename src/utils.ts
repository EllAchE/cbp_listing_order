import { logger } from "./logger";
import { LoggingResponse } from "./typing";

export const getTradingPairsFromTitle = (titleString: string): string[] => {
    const cbpPairReg = /(?<=\()(\w{1,10})(?=\))/gi;
    const matchArray = titleString.match(cbpPairReg);

    const mappedArray = matchArray?.map(pair => `USD-${pair}`)

    if (mappedArray) return mappedArray;
    else {
        logger.warn("extracted regex value didn't pass the next layer of validation")
        logger.warn(`the title was ${titleString}`)
        return [];
    }
}

export const createBaseLoggingResponse = (): LoggingResponse => {
    return {
        buyOrderResult: undefined,
        sellOrderResult: undefined,
        title: "TITLE NOT SET ON LOGGING RESPONSE",
        titleChanged: true,
        error: undefined,
        time: new Date().toLocaleDateString()
    }
}

export const marketOrderAmount = '100' // must be a string for api methods