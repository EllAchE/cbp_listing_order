import { getBlogTitle } from "./check_rss";
import { logger } from "./logger";
import { LoggingResponse } from "./typing";

export const createBaseLoggingResponse = ({
    title = "TITLE NOT SET ON LOGGING RESPONSE",
    buyOrderResult,
    sellOrderResult,
    error,
    titleChanged = true,
}): LoggingResponse => {
    return {
        buyOrderResult: buyOrderResult,
        sellOrderResult: sellOrderResult,
        title: title,
        titleChanged: titleChanged,
        error: error,
        time: new Date().toLocaleDateString()
    }
}

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

export const checkIfTitleIsAllListing = (title: string): boolean => {
    const regPatternAll = /(is|are) (now available|launching) on Coinbase$/i // for  4 different syntax cases item listing, and anchor at end to avoid cbp match
    // const regPatternPro = new RegExp(/(?<=\()(\w{1,5})(?=\) is launching on Coinbase Pro)/) // only runs for regular listings, can't buy on cbp when they list

    return regPatternAll.test(title)
}

export const marketOrderAmount = '1000' // must be a string for api methods

let lastTitle: string;

export const initializeLastTitle = async (): Promise<void> => {
    const lastTitleTest = await getBlogTitle()
    if (!lastTitleTest) throw Error("failed to intialize title")
    else {
        lastTitle = lastTitleTest
    }
}

export const getLastTitle = (): string => {
    return lastTitle;
}

export const updateLastTitle = (title: string): void => {
    lastTitle = title;
}
