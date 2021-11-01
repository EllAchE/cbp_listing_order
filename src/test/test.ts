require('jest')
const assert = require('assert')

import { getBlogTitle } from "../check_rss"
import { checkIfTitleIsAllListing, getTradingPairsFromTitle } from "../utils"

// todo add testing for multiple items being listed at the same time

const coinbaseTitleSingleListing = "Assemble Protocol (ASM) is now available on Coinbase";
const coinbaseTitleMultipleListing = "ARPA Chain (ARPA) and Perpetual Protocol (PERP) are now available on Coinbase";
const coinbaseTitleProSingleListing = "Assemble Protocol (ASM) is launching on Coinbase Pro";
const coinbaseTitleProMultipleListing = "ARPA Chain (ARPA), Bounce (AUCTION) and Perpetual Protocol (PERP) are launching on Coinbase Pro";
const coinbaseTitleNoParenthesis = "ARPA Chain ARPA), Bounce (AUCTION and Perpetual Protocol ( PERP) are launching on Coinbase Pro";

describe('Logging responses should work as expected', () => {
    it('Should create base logging response', () => {

    })

    it('Should create logging response with passed parameters', () => {

    })
})

describe('Trading pair extraction from titles should work as expected', () => {
    it('Should get single listing from title', () => {
        const tradingPairs = getTradingPairsFromTitle(coinbaseTitleSingleListing);
        expect(["USD-ASM"]).toEqual(tradingPairs);
    })

    it('Should get multiple listing from title', () => {
        const tradingPairs = getTradingPairsFromTitle(coinbaseTitleMultipleListing);
        expect(["USD-ARPA", "USD-PERP"]).toEqual(tradingPairs);
    })

    it('Should get no match from title without match', () => {
        assert.equal(0, getTradingPairsFromTitle(coinbaseTitleNoParenthesis));
        assert.equal(0, getTradingPairsFromTitle("").length);
    })
})

describe('Should determine if title is an all listing', () => {
    it('Should match on title with singular listing', () => {
        assert.equal(true, checkIfTitleIsAllListing(coinbaseTitleSingleListing))
    })

    it('Should match on title with multiple listing', () => {
        assert.equal(true, checkIfTitleIsAllListing(coinbaseTitleMultipleListing))
    })

    it('Should fail to match on title without listing', () => {
        assert.equal(false, checkIfTitleIsAllListing(coinbaseTitleProMultipleListing))
        assert.equal(false, checkIfTitleIsAllListing(coinbaseTitleProSingleListing))
        assert.equal(false, checkIfTitleIsAllListing(""))
    })
})

describe('Should get latest blog title', () => {
    it('Should get latest blog title', async () => {
        const title = await getBlogTitle()
        console.log(title)
        assert.equal("string", typeof title) // this test is bad, needs to look for nonempty
    })
})