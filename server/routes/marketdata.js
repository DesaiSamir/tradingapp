var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const { ts } = require('../config');

router.post('/', async function (req, res, next)  {
    ts.session_data = req.session;
    // console.log(req.body);

    const method = req.body.method;
    const url = req.body.url;
    const payload = req.body.payload;
    const marketdata = await helper.send(req, res, method, url, payload && payload);
    
    if(marketdata){
        // console.log(marketdata)
        res.send(marketdata);
    }
})

module.exports = router; 