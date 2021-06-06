const csp = require('./candleStickPatterns');

module.exports = {
    detectPattern: function(candles) {
        csp.bullishEngulfing(candles);
        csp.bearishEngulfing(candles);
        csp.bullishHarami(candles);
        csp.bearishHarami(candles);
        csp.hangingMan(candles);
        csp.morningStar(candles);
        csp.potentialMorningStar(candles);
        return candles;
    },
}