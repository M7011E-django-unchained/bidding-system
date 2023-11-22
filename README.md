# bidding-system

This is a bidding handler for the trading API created in Django, se more here: https://github.com/M7011E-django-unchained/trading_api

# Installation

## Prerequisites (for dev mode)
-  Node.js version 16 or newer

## How to install (dev mode)

Clone this repo into any folder. enter the `bidding-system` folder and run:
```bash
npm i
npm start
```

This will install all required packages and then run the program.

## For production
Clone this repo into any folder. enter the `bidding-system` folder, create an .env file which should look like this:
```
DATABASE_URL = <db_url>
TEST_DATABASE_URL = <db_url_for_testing_db>
NODE_ENV = production
```

Then run `docker-compose up`. 


# Note
This is not supposed to be a full system for handling auctions or similar, just handling bids and bidding in another larger project. In other words, this system alone is not doing anything useful.
