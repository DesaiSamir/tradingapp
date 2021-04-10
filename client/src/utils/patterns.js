module.exports = {
    detectPattern: function(candles) {
        if(candles.length > 10)
            for (let index = 10; index < candles.length; index++) {
                if(this.isBullisEngulfing(candles, index)) {
                    // console.log({previous: candles[index - 5], current: candles[index]})
                    candles[index].pattern = "Bullish Engulfing";
                } else if(this.isBerishEngulfing(candles, index)) {
                    // console.log({previous: candles[index - 7], current: candles[index]})
                    candles[index].pattern = "Berish Engulfing";
                }
            }
        
        return candles;
    },
    isBullisEngulfing: function(candles, index) {
        const currentDayCandle = candles[index];
        const previousDayCandle = candles[index - 1];
        const pastFifthCandle = candles[index - 7];

        if(this.isBerishCandle(previousDayCandle) && 
            currentDayCandle.open  < previousDayCandle.close && 
            currentDayCandle.close > previousDayCandle.open &&
            currentDayCandle.close < pastFifthCandle.open) {
            return true;
        }

        return false;
    }, 
    isBerishEngulfing: function(candles, index) {
        const currentDayCandle = candles[index];
        const previousDayCandle = candles[index - 1];
        const pastFifthCandle = candles[index - 7];

        if(this.isBullishCandle(previousDayCandle) && 
            currentDayCandle.open > previousDayCandle.close && 
            currentDayCandle.close < previousDayCandle.open &&
            currentDayCandle.close > pastFifthCandle.open) {
            return true;
        }

        return false;
    },
    isBerishCandle: function(candle) {

        if(candle.close < candle.open) {
            return true;
        }

        return false;
    }, 
    isBullishCandle: function(candle) {

        if(candle.open < candle.close) {
            return true;
        }

        return false;
    }
}