var patterns = require('./patterns');
const alpha = require('alphavantage')({ key: '' });

var apiTimer;
module.exports = {
    clearApiInterval: function () {
        clearInterval(apiTimer);
    },
    getRefreshInterval: function () {
        if(this.isRegularSessionTime()){
            return 1000;
        }

        return 10000;
    },
    isRegularSessionTime: function () {
        const sessionStartTime = new Date("1/1/2001 9:30:00 AM").getTime();
        const sessionEndTime = new Date("1/1/2001 4:00:00 PM").getTime();
        const currentTime = new Date().getTime();

        if (currentTime > sessionStartTime && currentTime < sessionEndTime) {
            return true;
        }

        return false;
    },
    send: async function (payload, cb) {
        var options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        console.log(options)
        const isBarChart = JSON.stringify(payload).indexOf('barchart') > 0 ? true : false;

        if (isBarChart) {
            this.clearApiInterval();
        
            apiTimer = setInterval(async () => {
                // console.log(options)
                const barData = await this.getMarketData(options, isBarChart);
                if(barData){
                    cb(barData);
                }

            }, this.getRefreshInterval());
        } else {
            
            // console.log(options)
            const quoteData = await this.getMarketData(options, isBarChart);
            if(quoteData){
                cb(quoteData[0]);
            }
        }
        
    },
    getMarketData: async function (options, isBarChart) {
        const data = await fetch("api/marketdata", options)
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => console.log({err})
        );
        
        if(data){
            var responseData = data;
            // console.log(data)
            if(responseData.statusCode >= 400) {
                this.clearApiInterval();
            } else {
                if(responseData.length > 0 && isBarChart){
                    responseData = patterns.detectPattern(this.formatTSData(responseData));
                } else if(isBarChart) {
                    responseData = {
                        status: "Error fetching data.", 
                    };
                } 
            }
            return responseData;
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
                        open: dataPoint.Open,
                        high: dataPoint.High,
                        low: dataPoint.Low,
                        close: dataPoint.Close,
                        volume: dataPoint.TotalVolume,
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

