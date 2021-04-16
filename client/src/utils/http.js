var patterns = require('./patterns');
const alpha = require('alphavantage')({ key: '' });

var barChartTimer, quoteTimer;
module.exports = {
    clearBarChartInterval: function () {
        clearInterval(barChartTimer);
    },
    clearQuoteInterval: function () {
        clearInterval(quoteTimer);
    },
    getRefreshInterval: function () {
        if(this.isRegularSessionTime()){
            return 2000;
        }

        return 10000;
    },
    isRegularSessionTime: function () {
        const sessionStartTime = new Date(new Date().toLocaleDateString() + " 9:30:00 AM");
        const sessionEndTime = new Date(new Date().toLocaleDateString() + " 4:00:00 PM");
        const currentTime = new Date();
        
        if (currentTime > sessionStartTime && currentTime < sessionEndTime) {
            return true;
        }

        return false;
    },
    getQuoteData: async function (payload, cb) {
        const quoteData = await this.send(payload);
        if(quoteData){
            cb(quoteData);
        }
    },
    getQuoteDataRecursive: function (payload, cb) {
        this.clearQuoteInterval();
        
        quoteTimer = setInterval(async () => {
            const quoteData = await this.send(payload);
            if(quoteData){
                cb(quoteData);
            }
        }, this.getRefreshInterval());
    },
    getBarChartData: function (payload, cb) {
        this.clearBarChartInterval();
        
        barChartTimer = setInterval(async () => {
            const barData = await this.send(payload);
            if(barData){
                var responseData = barData;
                if(responseData.length > 0){
                    responseData = patterns.detectPattern(this.formatTSData(responseData));
                } else {
                    responseData = {
                        status: "Error fetching data.", 
                        response: responseData,
                    };
                } 
                cb(responseData);
            }

        }, this.getRefreshInterval());
    },
    postPurchaseOrder: async function(payload, cb) {
        const purchaseOrder = await this.send(payload);
        if(purchaseOrder){
            cb(purchaseOrder);
        }
    },
    send: async function (payload) {
        console.log(payload);
        var options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        
        // console.log(options)

        const data = await fetch("api/marketdata", options)
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => console.log({err})

        );
        if(data){
            return data;
        }
        
    },
    formatTSData: function (data){
        var formatedData = [];
        const tsRegX = /\d+/g;
        // console.log(data)
        data.forEach(dataPoint => {
            if(dataPoint.TimeStamp){
                const ts = parseInt(dataPoint.TimeStamp.match(tsRegX)[0]);
                const date = new Date(ts);
                if(dataPoint.Open > 0){
                    formatedData.push({
                        date,
                        open: parseFloat(dataPoint.Open),
                        high: parseFloat(dataPoint.High),
                        low: parseFloat(dataPoint.Low),
                        close: parseFloat(dataPoint.Close),
                        volume: parseInt(dataPoint.TotalVolume),
                        dividend: "",
                        absoluteChange: "",
                        percentChange: "",
                        split: "",
                        pattern: ""
                    });
                }
            }
        })

        return formatedData.sort((a, b) => (a.date > b.date) ? 1 : -1);
    },
    get: async function (url, cb) {
        const res = await fetch(url)
            .then(res => res.json())
            .then(res => {
                return res
            })
            .catch(err => console.log({err})
        );

        if(res){
            cb(res);
        }
    },
    getaa: function (symbol, cb) {
        alpha.data.daily(symbol, 'compact').then(data => {
            const polished = alpha.util.polish(data);
            const formatPolished = this.formatAAData(polished)
            // console.log(formatPolished)
            cb(formatPolished);
          });
    },
    getdaily: function (symbol, cb) {
        alpha.data.daily(symbol, 'compact').then(data => {
            const polished = alpha.util.polish(data);
            const formatPolished = this.formatAAData(polished)
            // console.log(formatPolished)
            cb(formatPolished);
          });
    },
    getintraday: function (symbol, cb) {
        alpha.data.intraday(symbol, 'compact', 'json', '5min').then(data => {
            const polished = alpha.util.polish(data);
            const formatPolished = this.formatAAData(polished)
            console.log(formatPolished)
            cb(formatPolished);
          });
    },
    formatAAData: function (data){
        var formatedData = [];
         Object.keys(data).forEach(key => {
             const chartData = data[key]
             if (key.indexOf('meta') !== 0) {
                //  console.log(key)
                 Object.keys(chartData).forEach(item => {
                    const date = item;
                    const dataPoints = chartData[item];
                    // console.log(dataPoints)
                    const dt = new Date(date);
                    formatedData.push({
                        date: dt,
                        open: dataPoints.open,
                        high: dataPoints.high, 
                        low: dataPoints.low,
                        close: dataPoints.close,
                        volume: dataPoints.volume,
                        dividend: "",
                        absoluteChange: "",
                        percentChange: "",
                        split: ""
                    })
                 })
             }
         })

         return formatedData.sort((a, b) => (a.date > b.date) ? 1 : -1);

    }
};

