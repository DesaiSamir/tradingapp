const csp = require('./candleStickPatterns');

module.exports = {
    detectPattern: function(candles) {
        csp.bullishEngulfing(candles);
        csp.bearishEngulfing(candles);
            
        return candles;
    },
}