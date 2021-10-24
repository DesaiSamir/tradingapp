const csp = require('./candleStickPatterns');

module.exports = {
    detectPattern: function(candles, unit) {
        csp.bullishEngulfing(candles);
        csp.bearishEngulfing(candles);
        csp.threeBarPlayBullish(candles);
        csp.threeBarPlayBearish(candles);
        csp.bullishHarami(candles);
        csp.bearishHarami(candles);
        csp.hangingMan(candles);
        csp.morningStar(candles);
        csp.potentialMorningStar(candles);
        csp.potentialBullishEngulfing(candles);
        csp.buySetup(candles);
        if(unit !== 'Minute') {
            csp.near200SMA(candles);
        }
        return candles;
    },
}