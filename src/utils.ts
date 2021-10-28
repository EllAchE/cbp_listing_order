import { logger } from "./logger";

export const getTradingPairFromRegResult = (regArray: RegExpExecArray): string | undefined => {
    const firstMatch = regArray[0];
    const cbpPairReg = /.{5}/i

    if (cbpPairReg.test(firstMatch)) {
        return `USD-${firstMatch}`; // Assuming everything has a USD pair on cbp, seems to be
    }
    else {
        logger.warn("extracted regex value didn't pass the next layer of validation")
        logger.warn(`the matched value was ${firstMatch}`)
    }

    return undefined;
}