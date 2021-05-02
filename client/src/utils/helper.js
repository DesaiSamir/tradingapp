
module.exports = {
    formatDate: function(date, format) {
        var newDate = new Date(date);
        var dd = newDate.getDate();
        var mm = newDate.getMonth()+1; 
        var yyyy = newDate.getFullYear();
        
        if(dd<10){
            dd='0'+dd;
        } 

        if(mm<10) {
            mm='0'+mm;
        } 
        switch (format) {
            case 'mm-dd-yyyy':
                newDate = mm + '-' + dd + '-' + yyyy;
                break; 

            case 'yyyy-mm-dd':
                newDate = yyyy + '-' + mm + '-' + dd;
                break;
                 
            default:
                newDate = mm + '-' + dd + '-' + yyyy;
                break;
        }
        
        return newDate;
    },
    newDate: function(date){
        date = new Date(date)
        var newDate = new Date(date.setDate(date.getDate() + 1));
        return this.formatDate(newDate);
    },
    getPatternCandleList: function(chartData = [], symbol){
        var patternCandles = [];
        if(chartData.length > 0){
            chartData.reverse();
            var currentCandles = [], lastCandles = [], lastBullCandles = [], lastBearCandles = [];

            currentCandles.push({...chartData[1], title: '', symbol});
            currentCandles.push({...chartData[0], title: 'Current Candle', symbol});
            patternCandles.push(currentCandles);
            
            lastCandles.push({...chartData[2], title: '', symbol});
            lastCandles.push({...chartData[1], title: 'Last Closed Candle', symbol});
            patternCandles.push(lastCandles);

            const lastBullishIndex = chartData.findIndex(candle=> candle.isBullishEngulfing);
            if(lastBullishIndex > 0){
                lastBullCandles.push({...chartData[lastBullishIndex + 1], title: '', symbol});
                lastBullCandles.push({...chartData[lastBullishIndex], title: 'Last Bullish Candle', symbol});
                patternCandles.push(lastBullCandles);
            }

            const lastBearishIndex = chartData.findIndex(candle=> candle.isBearishEngulfing);
            if(lastBearishIndex > 0){
                lastBearCandles.push({...chartData[lastBearishIndex + 1], title: '', symbol});
                lastBearCandles.push({...chartData[lastBearishIndex], title: 'Last Bearish Candle', symbol});
                patternCandles.push(lastBearCandles);
            }
        }
        return (patternCandles);
    },
    getMiniChartCandles: function(candles){
        var newCandles = [];
        const patternCandle = candles[1];
        const previousCandle = candles[0];
        const dayBeforeYesterday = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
        const tomorrow = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        tomorrow.setDate(tomorrow.getDate() + 1);

        newCandles.push({
            "date": dayBeforeYesterday,
            "open": previousCandle.open,
            "close": previousCandle.open,
            "high": previousCandle.open,
            "low": previousCandle.open,
            "title": '',
            "symbol": previousCandle.symbol,
        });

        newCandles.push(previousCandle);

        newCandles.push(patternCandle);

        newCandles.push({
            "date": tomorrow,
            "open": patternCandle.close,
            "high": patternCandle.close,
            "low": patternCandle.close,
            "close": patternCandle.close,
            "title": '',
            "symbol": previousCandle.symbol,
        });

        return newCandles;
    },
}