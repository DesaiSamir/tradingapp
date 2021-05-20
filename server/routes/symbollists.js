var express = require('express');
var router = express.Router();
const watchlist = require('../db/watchlist');
const helper = require('../utils/helpers');

router.get('/', async function  (req, res, next)  {
    
    const url = `/v2/data/symbollists`;
    const symbollistsData = await helper.send(req, res, 'GET', url);
    if(symbollistsData){
        res.send(symbollistsData);
    }
        
})

router.get('/:symbol_list_id', async function  (req, res, next)  {
    const url = `/v2/data/symbollists/${req.params.symbol_list_id}`;
    const symbollists = await helper.send(req, res, 'GET', url);
    if(symbollists){
        res.send(symbollists);
    }
})

router.get('/:symbol_list_id/symbols', async function  (req, res, next)  {
    const url = `/v2/data/symbollists/${req.params.symbol_list_id}/symbols`;
    const symbollists = await helper.send(req, res, 'GET', url);
    if(symbollists){
        res.send(symbollists);
    }
})

module.exports = router;