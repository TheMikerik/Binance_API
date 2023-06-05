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
var max_manip_log = 11;
var manipulation_entities = [];
var similar_trades = 0;
var block_id = 0;
var manipulation_percentage = 1;
var manipulationLogEntries = [];
var block_size = 10;
var manipulationLog = document.getElementById('manipulation_text');


class Catcher{
    constructor(input, vol, price){
        this.messages = input;
        this.volume = vol;
        this.current_price = price;
    }
}
class Block{
    constructor(id, similar, manipPerc){
        this.id = id;
        this.similarTr = similar;
        this.manipPerc = manipPerc;

        this.log = this.manipPerc + "% - Block " + this.id
                    + " with " + this.similarTr + "/"
                    + block_size + " potential manipulation attempts.";
    }
}

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
        var tradeEntry = messages.q
                         + " BTC trade has been opened on the price of "
                         + curPrice + "$ with unique ID: " + allTradeCount;
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


    /* Manipulation calculus */
    if (manipulation_entities.length >= block_size){
        manipulation_entities.shift();
    }
    manipulation_entities.push(volume);
    
    if (allTradeCount === 0){
    }
    else if (allTradeCount % block_size === 0){
        for (var i=0; i<(manipulation_entities.length - 1); i++){
            if (volume === manipulation_entities[i]){
                similar_trades++;
            }
        }

        var similar_trades_in_block = similar_trades/block_size;
        manipulation_percentage = parseFloat((similar_trades_in_block)*100).toFixed(2);
        if(manipulationLogEntries.length >= max_manip_log){
            manipulationLogEntries.shift();
        }
        var manipulationEntry = manipulation_percentage
                                + "% - Block " + block_id
                                + " with " + similar_trades
                                + "/" + block_size
                                + " potential manipulation attempts."
        manipulationLogEntries.push(manipulationEntry);

        manipulationLog.innerHTML = "<br>";

        for (var i=manipulationLogEntries.length-1; i>=0; i--){
            var manipulationLogEntry = manipulationLogEntries[i];
            var manipulationLogItem = document.createElement("div");

            if (i === manipulationLogEntries.length - 1 && similar_trades_in_block !==0){
                var highligh_low_prob = document.createElement("span");
                highligh_low_prob.textContent = manipulationLogEntry;
                highligh_low_prob.classList.add("highlight_low");
                manipulationLogItem.appendChild(highligh_low_prob);
            }
            else {
                manipulationLogItem.textContent = manipulationLogEntry;
            }
            manipulationLog.prepend(manipulationLogItem);
        }


        block_id++;
        similar_trades=0;
    }




    allTradeCount++;
    allTradeCounter.textContent = "Recived trades: " + allTradeCount;
};