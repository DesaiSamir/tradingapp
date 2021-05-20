var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const pattern = require('../db/pattern');

router.get('/', async function  (req, res, next)  {
    
    const patterns = await pattern.getAllPatterns();
    
    if(patterns){
        patterns.forEach((pattern) => {
            const patternCandles = JSON.parse(pattern.candles);
            pattern.candles = patternCandles;
        })
        res.send(patterns);
    } else {
        res.send([]);
    }
})

router.get('/intraday', async function  (req, res, next)  {
    
    const patterns = await pattern.getIntradayPatterns();
    
    if(patterns){
        patterns.forEach((pattern) => {
            const patternCandles = JSON.parse(pattern.candles);
            pattern.candles = patternCandles;
        })
        res.send(patterns);
    } else {
        res.send([]);
    }
})

router.get('/daily', async function  (req, res, next)  {
    
    const patterns = await pattern.getDailyPatterns();
    
    if(patterns){
        patterns.forEach((pattern) => {
            const patternCandles = JSON.parse(pattern.candles);
            pattern.candles = patternCandles;
        })
        res.send(patterns);
    } else {
        res.send([]);
    }
})

router.get('/types', async function  (req, res, next)  {
    
    const pattern_types = await pattern.getPatterns();
    
    if(pattern_types){
        res.send(pattern_types);
    }
})

router.get('/timeframes', async function  (req, res, next)  {
    
    const timeframes = await pattern.getTimeframes();
    
    if(timeframes){
        res.send(timeframes);
    }
})

router.post('/', async function  (req, res, next)  {
    
    const payload = req.body.payload;

    const patterns = await pattern.addNewPatterns(payload);
    
    if(patterns){
        res.send(patterns);
    }
})

router.put('/hasposition', async function  (req, res, next)  {
    
    const payload = req.body;
    const patterns = await pattern.updatePatternIfHasPosition(payload.symbols);
    
    if(patterns){
        res.send(patterns);
    }
})

router.put('/hasorder', async function  (req, res, next)  {
    
    const payload = req.body;
    const patterns = await pattern.updatePatternIfHasOrder(payload.symbols);
    
    if(patterns){
        res.send(patterns);
    }
})

router.delete('/', async function  (req, res, next)  {
    
    const patterns = await pattern.deleteIntradayPatterns();
    
    if(patterns){
        res.send(patterns);
    }
})

router.delete('/:symbol', async function  (req, res, next)  {
    
    const symbol = req.params.symbol;

    const patterns = await pattern.deleteIntradayPatternsBySymbol(symbol);
    
    if(patterns){
        res.send(patterns);
    }
})

module.exports = router;