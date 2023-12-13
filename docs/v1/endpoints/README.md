# API v1 endpoints

## <http://localhost:5000/api/v1/createBid>

Body

```json
{
    "auctionId": 1,
    "bidder": "TestUser",
    "bidderId": 1,
    "bidAmount": 99,
    "bidTime": "bid timestamp"
}
```

## <http://localhost:5000/api/v1/getAllBids>

## <http://localhost:5000/api/v1/getAllBidsByAuctionId/:auctionId>

## <http://localhost:5000/api/v1/getAllBidsByBidderId/:bidderId>

## <http://localhost:5000/api/v1/getAllBids/:bidderId/:auctionId>

## <http://localhost:5000/api/v1/getOneBid/:id>

## <http://localhost:5000/api/v1/getWinnerByAuctionId/:auctionId>

Body

### Body

```json
{
    "endTime": "Endtime for auction in ISO 8601 format"
}
```

## <http://localhost:5000/api/v1/updateOneBid/:id>

Body

```json
{
    "auctionId": 1,
    "bidder": "TestUser",
    "bidderId": 1,
    "bidAmount": 500,
    "bidTime": "current timestamp"
}
```

## <http://localhost:5000/api/v1/deleteOneBid/:id>

## <http://localhost:5000/api/v1/deleteAllBidsByAuctionId/:auctionId>
