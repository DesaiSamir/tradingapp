module.exports = {
    formatDate: function(date, format) {
        var newDate = new Date(date);
        // console.log({date, newDate});
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
    getMiniChartCandles: function(candles){
        var newCandles = [];
        const patternCandle = candles[1];
        const previousCandle = candles[0];
        const todayDate = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        const dayBeforeYesterday = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
        const yesterday = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(new Date().toLocaleDateString() + " 0:00:00 AM");
        tomorrow.setDate(tomorrow.getDate() + 1);

        previousCandle.date = yesterday;
        patternCandle.date = todayDate;

        newCandles.push({
            "date": dayBeforeYesterday,
            "open": previousCandle.open,
            "close": previousCandle.open,
            "high": previousCandle.open,
            "low": previousCandle.open,
        });

        newCandles.push(previousCandle);

        newCandles.push(patternCandle);

        newCandles.push({
            "date": tomorrow,
            "open": patternCandle.close,
            "high": patternCandle.close,
            "low": patternCandle.close,
            "close": patternCandle.close,
        });

        return newCandles;
    },
}