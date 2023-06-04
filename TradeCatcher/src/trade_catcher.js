var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
var trades = document.getElementById('tradeDiv');

/* Catcher part */
var allTradeCounter = document.getElementById('allTradeCounter');
var allTradeCount = 0;
var catchedTradesCounter = document.getElementById('catchedTradeCounter');
var catchedTradeCount = 0;
var biggestTrade = document.getElementById('biggestTrade');
var biggestTradeFloat = 0;
var curretnPrice = document.getElementById('currentPrice');
var curPrice = 0;
var tradeLog = document.getElementById('tradeDiv');
var max_trade_logs = 10;
var tradeLogEntries = [];

/* Manipulation part */
var manipulation_HTML = document.getElementById('manipulation_chance');
var max_manip_log = 7;
var manipulation_entities = [];
var similar_trades, block_id = 0;
var manipulation = [];

binanceSocket.onmessage = function(out) {
    var messages = JSON.parse(out.data);
    var volume = parseFloat(messages.q);
    var curPrice = parseFloat(messages.p).toFixed(2);

    if (volume > biggestTradeFloat) {
        biggestTradeFloat = volume;
        biggestTrade.textContent = "Biggest opened: " + biggestTradeFloat + "btc";
    }
    if (volume > 0.5) {
        if (tradeLogEntries.length >= max_trade_logs) {
        tradeLogEntries.shift();
        }
        var tradeEntry = messages.q + " BTC trade has been opened on the price of " + curPrice + "$ with unique ID: " + allTradeCount;
        tradeLogEntries.push(tradeEntry);

        tradeLog.innerHTML = "<br>";

        for (var i = tradeLogEntries.length - 1; i >= 0; i--) {
        var tradeLogEntry = tradeLogEntries[i];
        var tradeLogItem = document.createElement("div");
        tradeLogItem.textContent = tradeLogEntry;
        tradeLog.prepend(tradeLogItem);
        }

        catchedTradeCount++;
        catchedTradesCounter.textContent = "Catched trades: " + catchedTradeCount;
    }


    if (manipulation_entities.length >= max_manip_log){
        manipulation_entities.shift();
    }
    manipulation_entities.push(volume);
    for (var i=0; i<manipulation_entities.length; i++){
        if (volume === manipulation_entities[i]){
            similar_trades++;
        }
    }
    if (allTradeCount % 100 === 0){
        NONE - Block NONE had NONE similar trades


        block_id++;
        similar_trades=0;
    }




    allTradeCount++;
    allTradeCounter.textContent = "Recived trades: " + allTradeCount;
};