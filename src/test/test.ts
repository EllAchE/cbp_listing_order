import { getBlogTitle } from "../check_rss"

require('jest')
const assert = require('assert')

// todo add testing for multiple items being listed at the same time

describe('Logging responses should work as expected', () => {
    it('Should create base logging response', () => {
    })

    it('Should create logging response with passed parameters', () => {
    })
})

describe('Trading pair extraction from titles should work as expected', () => {
    it('Should get single listing from title', () => {
    })

    it('Should get multiple listing from title', () => {
    })

    it('Should get no match from title without match', () => {
    })
})

describe('Should determine if title is an all listing', () => {
    it('Should match on title with singular listing', () => {
    })

    it('Should match on title with multiple listing', () => {
    })

    it('Should fail to match on title without listing', () => {
    })
})

describe('Should get latest blog title', () => {
    it('Should get latest blog title', async () => {
        const title: string = await getBlogTitle()
        assert.equal("string", typeof title)
    })
})