var express = require('express');
var router = express.Router();
const watchlist = require('../db/watchlist');
const helper = require('../utils/helpers');

router.get('/', async function  (req, res, next)  {
    const allWatchlist = await watchlist.getAllWatchlist();

    if(allWatchlist){
        const stocks =  Array.prototype.map.call(allWatchlist, s => s.symbol).toString();
        const url = `/v2/data/quote/${stocks}`;
        const watchlistData = await helper.send(req, res, 'GET', url);
        if(watchlistData){
            res.send(watchlistData);
        }
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