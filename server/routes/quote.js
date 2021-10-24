var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');

router.get('/:symbols', async function  (req, res, next)  {
    try {
        const symbols = req.params.symbols;
        const url = `/v2/data/quote/${symbols}`;
        const quoteData = await helper.send(req, res, 'GET', url);
        if(quoteData){
            res.send(quoteData);
        } else {
            res.send([])
        }
            
    } catch (error) {
        console.error(error);
        res.send([])
    }
})

module.exports = router;