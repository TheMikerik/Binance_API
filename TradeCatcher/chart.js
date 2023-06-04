var chart = LightweightCharts.createChart(document.getElementById('volumeChart'), {
	width: 800,
  height: 400,
	layout: {
		background: {
            type: 'solid',
            color: '#E8EDDF',
        },
		textColor: 'rgba(0, 0, 0, 0.9)',
	},
	grid: {
		vertLines: {
			color: 'rgba(0, 0, 0, 0.5)',
		},
		horzLines: {
			color: 'rgba(0, 0, 0, 0.5)',
		},
	},
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
	rightPriceScale: {
		borderColor: 'rgba(0, 0, 0, 0.8)',
	},
	timeScale: {
		borderColor: 'rgba(0, 0, 0, 0.8)',
	},
});

var candleSeries = chart.addCandlestickSeries({
  upColor: 'rgba(0, 255, 0, 1)',
  downColor: 'rgba(255, 0, 0, 1)',
  borderDownColor: 'rgba(50, 0, 0, 1)',
  borderUpColor: 'rgba(0, 50, 0, 1)',
  wickDownColor: 'rgba(255, , 0, 1)',
  wickUpColor: 'rgba(0, 255, 0, 1)',
});

var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1s");

binanceSocket.onmessage = function (event) {	
	var message = JSON.parse(event.data);

	var candlestick = message.k;

	console.log(candlestick)

	candleSeries.update({
		time: candlestick.t / 1000,
		open: candlestick.o,
		high: candlestick.h,
		low: candlestick.l,
		close: candlestick.c
	})
}