var express = require('express');
var router = express.Router();
const watchlist = require('../db/watchlist');
const helper = require('../utils/helpers');

function addDayTradeFlag(watchlist, allWatchlist) {
    if(watchlist.length > 0){
        watchlist.forEach(wl => {
            const dbWl = allWatchlist.filter(w => w.symbol === wl.Symbol)[0];
            wl.DayTrade = dbWl.day_trade === 1 ? true : false;
        });
        return watchlist;
    } else {
        return [];
    }
}

router.get('/', async function  (req, res, next)  {
    try {
        const allWatchlist = await watchlist.getAllWatchlist();

        if(allWatchlist){
            const stocks =  Array.prototype.map.call(allWatchlist, s => s.symbol).toString();
            const url = `/v2/data/quote/${stocks}`;
            const watchlistData = await helper.send(req, res, 'GET', url);
            if(watchlistData){
                res.send(addDayTradeFlag(watchlistData, allWatchlist));
            } else {
                res.send([])
            }
        }
            
    } catch (error) {
        console.error(error);
        res.send([])
    }
})

router.get('/daytrade', async function  (req, res, next)  {
    try{
        const allWatchlist = await watchlist.getDayTradeWatchlist();

        if(allWatchlist){
            const stocks =  Array.prototype.map.call(allWatchlist, s => s.symbol).toString();
            const url = `/v2/data/quote/${stocks}`;
            const watchlistData = await helper.send(req, res, 'GET', url);
            if(watchlistData){
                res.send(addDayTradeFlag(watchlistData, allWatchlist));
            } else {
                res.send([])
            }
        }
            
    } catch (error) {
        console.error(error);  
        res.send([])      
    }
})

router.get('/:symbol', async function  (req, res, next)  {
    const url = `/v2/data/quote/${req.params.symbol}`;
    const quote = await helper.send(req, res, 'GET', url);
    if(quote){
        res.send(quote);
    }
})

router.post('/', async function  (req, res, next)  {
    const payload = req.body;
    const addData = await watchlist.saveWatchlist(payload);
    
    if(addData){
        res.send(addData);
    }
})

router.post('/daytrade', async function  (req, res, next)  {
    const payload = req.body;
    const addData = await watchlist.toggleDayTradeBySymbol(payload.Symbol);
    
    if(addData){
        res.send(addData);
    }
})

router.delete('/:symbol', async function  (req, res, next)  {
    const watchlistSymbol = await watchlist.getWatchlistBySymbol(req.params.symbol);
    
    if(watchlistSymbol){
        const deleteSymbol = await watchlist.deleteWatchlist(watchlistSymbol);
        if(deleteSymbol){
            res.send(watchlistSymbol);
        }
    }
})

module.exports = router;