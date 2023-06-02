# INFO
This part is using **wscat**

# HOW TO USE
```bash
wscat -c wss://stream.binance.com:9443/ws/btcusdt@trade
```

Output of this web socket is following:
{
  "e": "trade",       // Event type
  "E": 1672515782136, // Event time
  "s": "BNBBTC",      // Symbol
  "t": 12345,         // Trade ID
  "p": "0.001",       // Price
  "q": "100",         // Quantity
  "b": 88,            // Buyer order ID
  "a": 50,            // Seller order ID
  "T": 1672515782136, // Trade time
  "m": true,          // Is the buyer the market maker?
  "M": true           // Ignore
}