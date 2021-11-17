# Coinbase Listing Order Bot

Bot that listens to Coinbase Blog RSS feed and purchases newly listed (on standard coinbase, not coinbase pro) coins. Uses 
coinbasepro-node library; Typescript/Node. When a new latest blog post is detected its title is parsed and new listings are extracted (assuming a specific title syntax pattern). Immediate market buy orders are placed, then all positions exited 3 minutes later (again via market order).

*This is the naive implementation.

# Setup

API Docs - https://docs.pro.coinbase.com/


1. Follow the steps defined in cbp docs/on the site to create a key, secret and passphrase for use in auth
2. Create a file called .env and add the following values:


    key=your_api_key
    secret=your_b64_secret
    passphrase=your_passphrase


### Outstanding work
- Parse latest tweets instead of RSS
- Add more nuanced sell logic (immediate limit)
- Identify and do not purchase stablecoins/add a purchase blacklist
- Support trading on alternate exchanges and use Pro listings as well