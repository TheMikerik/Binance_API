# INFO
This part is using **wscat**

# HOW TO USE

**Every placed trade on specific coin**
```bash
wscat -c wss://stream.binance.com:9443/ws/btcusdt@trade
```

Output of this web socket is following:
*  "e": "trade",       // Event type
*  "E": 1672515782136, // Event time
*  "s": "BNBBTC",      // Symbol
*  "t": 12345,         // Trade ID
*  "p": "0.001",       // Price
*  "q": "100",         // Quantity
*  "b": 88,            // Buyer order ID
*  "a": 50,            // Seller order ID
*  "T": 1672515782136, // Trade time
*  "m": true,          // Is the buyer the market maker?
*  "M": true           // Ignore


**Candlestick movement in selected time**
```bash
wscat -c wss://stream.binance.com:9443/ws/btcusdt@kline_5m
```
Output of this web socket is following:

*    "e": "kline",         // Event type
*    "E": 1672515782136,   // Event time
*    "s": "BNBBTC",        // Symbol
*    "t": 1672515780000, // Kline start time
*    "T": 1672515839999, // Kline close time
*    "s": "BNBBTC",      // Symbol
*    "i": "1m",          // Interval
*    "f": 100,           // First trade ID
*    "L": 200,           // Last trade ID
*    "o": "0.0010",      // Open price
*    "c": "0.0020",      // Close price
*    "h": "0.0025",      // High price
*    "l": "0.0015",      // Low price
*    "v": "1000",        // Base asset volume
*    "n": 100,           // Number of trades
*    "x": false,         // Is this kline closed?
*    "q": "1.0000",      // Quote asset volume
*    "V": "500",         // Taker buy base asset volume
*    "Q": "0.500",       // Taker buy quote asset volume
*    "B": "123456"       // Ignore
