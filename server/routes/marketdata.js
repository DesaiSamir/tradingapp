var express = require('express');
// const fetch = require('node-fetch');
var router = express.Router();
const helper = require('../utils/helpers');
const { ts } = require('../config');


router.get('/', async function (req, res, next)  {
    const marketdata = await helper.get(req, req.query.q);
    res.send({marketdata});
})

router.post('/', async function (req, res, next)  {
    ts.session_data = req.session;
    // console.log(req.body);
    const marketdata = await helper.send(req, req.body.method, req.body.url, req.body.payload && req.body.payload);
    
    if(marketdata){
        // console.log(marketdata)
        res.send(marketdata);
    }
})

module.exports = router; 