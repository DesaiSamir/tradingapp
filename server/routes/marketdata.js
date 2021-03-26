var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');


router.get('/', async function (req, res, next)  {
    const marketdata = await helper.get(req.query.q);
    res.send({marketdata});
})

module.exports = router; 