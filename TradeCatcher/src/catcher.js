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
var manipulation_entities = [];
var similar_trades = 0;
var block_id = 0;
var manipulation_percentage = 1;
var manipulationLogEntries = [];
var manipulationLog = document.getElementById('manipulation_text');

const max_manip_log = 11;
const block_size = 75;

class Block{
    constructor(id, similar, manipPerc){
        this.id = id;
        this.similarTr = similar;
        this.manipPerc = manipPerc;

        this.logger = this.manipPerc + "% - Block " + this.id
                    + " has " + this.similarTr + "/"
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
        if (similar_trades !== 0){
            similar_trades++;
        }

        var similar_trades_in_block = similar_trades/block_size;
        manipulation_percentage = parseFloat((similar_trades_in_block)*100).toFixed(2);

        var block = new Block(block_id, similar_trades, manipulation_percentage);

        if(manipulationLogEntries.length >= max_manip_log){
            manipulationLogEntries.shift();
        }
        
        manipulationLogEntries.push(block);

        manipulationLog.innerHTML = "<br>";

        for (var i=manipulationLogEntries.length-1; i>=0; i--){
            var manipulationLogEntry = manipulationLogEntries[i].logger;
            var manipulationLogItem = document.createElement("div");

            if ( manipulationLogEntries[i].manipPerc > 0 && manipulationLogEntries[i].manipPerc <= 10.00 ){
                var highligh_low_prob = document.createElement("span");
                highligh_low_prob.textContent = manipulationLogEntry + " Negligible similarity.";
                highligh_low_prob.classList.add("highlight_low");
                manipulationLogItem.appendChild(highligh_low_prob);
            }
            else if ( manipulationLogEntries[i].manipPerc > 10.00 && manipulationLogEntries[i].manipPerc <= 45.00 ){
                var highligh_mid_prob = document.createElement("span");
                highligh_mid_prob.textContent = manipulationLogEntry + " Suspicious.";
                highligh_mid_prob.classList.add("highlight_mid");
                manipulationLogItem.appendChild(highligh_mid_prob);
            }
            else if ( manipulationLogEntries[i].manipPerc > 45.00 ){
                var highligh_high_prob = document.createElement("span");
                highligh_high_prob.textContent = manipulationLogEntry + " Manipulation alert!";
                highligh_high_prob.classList.add("highlight_high");
                manipulationLogItem.appendChild(highligh_high_prob);
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