var isPatternBullish = false;
function bodyLen(candlestick) {
    return Math.abs(candlestick.open - candlestick.close);
}

function candleLen(candlestick) {
    return Math.abs(candlestick.high - candlestick.low);
}

function wickLen(candlestick) {
    return candlestick.high - Math.max(candlestick.open, candlestick.close);
}

function tailLen(candlestick) {
    return Math.min(candlestick.open, candlestick.close) - candlestick.low;
}

function isBullish(candlestick) {
    return candlestick.open < candlestick.close;
}

function isBearish(candlestick) {
    return candlestick.open > candlestick.close;
}

function isHammerLike(candlestick) {
    return tailLen(candlestick) > (bodyLen(candlestick) * 2) &&
           wickLen(candlestick) < bodyLen(candlestick);
}

function isInvertedHammerLike(candlestick) {
    return wickLen(candlestick) > (bodyLen(candlestick) * 2) &&
           tailLen(candlestick) < bodyLen(candlestick);
}

function isTopShadowEngulfed(candle1, candle2){
    if((candle2.open >= candle1.high) && (candle2.close <= candle1.open && candle2.close <= candle1.close)){
        return true;
    }
    
    if((candle2.open <= candle1.open && candle2.open <= candle1.close) && (candle2.close >= candle1.high)){
        return true;
    }
    
    return false;
}

function isBottomShadowEngulfed(candle1, candle2){
    if((candle2.open >= candle1.open && candle2.open >= candle1.close) && (candle2.close <= candle1.low)){
        return true;
    }
    
    if((candle2.open <= candle1.low) && (candle2.close >= candle1.open && candle2.close >= candle1.close)){
        return true;
    }
    
    return false;
}

// Check if Candle1 is Engulfed by Candle2
function isEngulfed(candle1, candle2) {
    if((candle2.open >= candle1.open && candle2.open >= candle1.close) && (candle2.close <= candle1.open && candle2.close <= candle1.close)){
        return true;
    }
    
    if((candle2.open <= candle1.open && candle2.open <= candle1.close) && (candle2.close >= candle1.open && candle2.close >= candle1.close)){
        return true;
    }
    
    return false;
}

function isGap(lowest, upmost) {
    return Math.max(lowest.open, lowest.close) < Math.min(upmost.open, upmost.close);
}

function isGapUp(previous, current) {
    return isGap(previous, current);
}

function isGapDown(previous, current) {
    return (current.open < previous.close && current.close < penetrationPercentPrice(previous, 5));
}

function isDoji(candlestick){
    return  !isHammerLike(candlestick) && 
            getCandleToBodyPercentValue(candlestick, bodyLen(candlestick)) < 30;
}

function getCandleToBodyPercentValue(candlestick){
    return (bodyLen(candlestick) * 100) / candleLen(candlestick) ;
}

// function getCandlePercentValue(candlestick, percent){
//     return (candleLen(candlestick) * percent / 100);
// }

function getBodyPercentValue(candlestick, percent){
    return (bodyLen(candlestick) * percent / 100);
}

function penetrationPercentPrice(candlestick, percent){
    const candlePercentPrice = getBodyPercentValue(candlestick, percent);
    if(isBullish(candlestick)){
        return candlestick.close - candlePercentPrice;
    } else {
        return candlestick.close + candlePercentPrice;
    }
}
// Dynamic array search for callback arguments.
function findPattern(dataArray, callback) {
    const upperBound = (dataArray.length - callback.length) + 1;
    const matches = [];
    const callbackName = callback.name;

    for (let i = 0; i < upperBound; i++) {
        const args = [];

        // Read the leftmost j values at position i in array.
        // The j values are callback arguments.
        for (let j = 0; j < callback.length; j++) {
            args.push(dataArray[i + j]);
        }

        // Destructure args and find matches.
        if (callback(...args)) {
            dataArray[i + args.length - 1]["patternType"] = isPatternBullish ? "bullish" : "bearish";
            dataArray[i + args.length - 1]["pattern"] += callbackName.substring(2, callbackName.length) + " ";
            
            dataArray[i]["candle"] = 0;
            dataArray[i + args.length - 1]["candle"] = 1;

            matches.push(args);
            // console.log(args)
            // break;
            // matches.push(args[1]);
        } 
    }

    return matches;
}

// Boolean pattern detection.
// @public

function isHammer(candlestick) {
    return isBullish(candlestick) &&
           isHammerLike(candlestick);
}

function isInvertedHammer(candlestick) {
    return isBearish(candlestick) &&
           isInvertedHammerLike(candlestick);
}

function isHangingMan(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isGapUp(previous, current) &&
           isHammerLike(current);
}

function isShootingStar(previous, middle, current) {
    return isBullish(previous) &&
           isBearish(middle) &&
           isGapUp(previous, middle) &&
           (isInvertedHammerLike(middle) || isDoji(middle)) &&
           (current.close < middle.close) &&
           !isDoji(current);
}

function isMorningStar(previous, middle, current) {
    const currCloseInUpperHalf = current.close >= penetrationPercentPrice(previous, 50);
    return isBearish(previous) &&
           isBullish(current) &&
           isGapDown(previous, middle) &&
           (isHammerLike(middle) || isDoji(middle)) && 
           (current.close > middle.close) &&
           !isDoji(current) &&
           currCloseInUpperHalf;
}

function isPotentialMorningStar(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isGapDown(previous, current) &&
           (isHammerLike(current) || isDoji(current));
}

function isBullishEngulfing(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isEngulfed(previous, current) &&
           current.volume >= previous.volume;
}

function isBearishEngulfing(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isEngulfed(previous, current) &&
           current.volume >= previous.volume;
}

function isBullishHarami(previous, current) {
    const currOpenInLowerHalf = current.open <= penetrationPercentPrice(previous, 40);
    const currCloseInUpperHalf = current.close >= penetrationPercentPrice(previous, 40);
    return isBearish(previous) &&
           isBullish(current) &&
           isEngulfed(current, previous) &&
           isBottomShadowEngulfed(current, previous) &&
           currOpenInLowerHalf &&
           currCloseInUpperHalf;
}

function isBearishHarami(previous, current) {
    const currOpenInUpperHalf = current.open >= penetrationPercentPrice(previous, 40);
    const currCloseInLowerHalf = current.close <= penetrationPercentPrice(previous, 40);
    return isBullish(previous) &&
           isBearish(current) &&
           isEngulfed(current, previous) &&
           isTopShadowEngulfed(current, previous) &&
           currOpenInUpperHalf &&
           currCloseInLowerHalf;
}

function isBullishKicker(previous, current) {
    return isBearish(previous) &&
           isBullish(current) &&
           isGapUp(previous, current);
}

function isBearishKicker(previous, current) {
    return isBullish(previous) &&
           isBearish(current) &&
           isGapDown(previous, current);
}

// Pattern detection in arrays.
// @public

function hammer(dataArray) {
    isPatternBullish = true;
    return findPattern(dataArray, isHammer);
}

function invertedHammer(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isInvertedHammer);
}

function hangingMan(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isShootingStar);
}

function shootingStar(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isShootingStar);
}

function morningStar(dataArray){
    isPatternBullish = true;
    return findPattern(dataArray, isMorningStar);
}

function potentialMorningStar(dataArray){
    isPatternBullish = true;
    return findPattern(dataArray, isPotentialMorningStar);
}

function bullishEngulfing(dataArray) {
    isPatternBullish = true;
    return findPattern(dataArray, isBullishEngulfing);
}

function bearishEngulfing(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isBearishEngulfing);
}

function bullishHarami(dataArray) {
    isPatternBullish = true;
    return findPattern(dataArray, isBullishHarami);
}

function bearishHarami(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isBearishHarami);
}

function bullishKicker(dataArray) {
    isPatternBullish = true;
    return findPattern(dataArray, isBullishKicker);
}

function bearishKicker(dataArray) {
    isPatternBullish = false;
    return findPattern(dataArray, isBearishKicker);
}

module.exports.isHammer = isHammer;
module.exports.isInvertedHammer = isInvertedHammer;
module.exports.isHangingMan = isHangingMan;
module.exports.isShootingStar = isShootingStar;
module.exports.isMorningStar = isMorningStar;
module.exports.isBullishEngulfing = isBullishEngulfing;
module.exports.isBearishEngulfing = isBearishEngulfing;
module.exports.isBullishHarami = isBullishHarami;
module.exports.isBearishHarami = isBearishHarami;
module.exports.isBullishKicker = isBullishKicker;
module.exports.isBearishKicker = isBearishKicker;

module.exports.hammer = hammer;
module.exports.invertedHammer = invertedHammer;
module.exports.hangingMan = hangingMan;
module.exports.shootingStar = shootingStar;
module.exports.morningStar = morningStar;
module.exports.potentialMorningStar = potentialMorningStar;
module.exports.bullishEngulfing = bullishEngulfing;
module.exports.bearishEngulfing = bearishEngulfing;
module.exports.bullishHarami = bullishHarami;
module.exports.bearishHarami = bearishHarami;
module.exports.bullishKicker = bullishKicker;
module.exports.bearishKicker = bearishKicker;