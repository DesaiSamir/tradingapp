var express = require('express');
var router = express.Router();
const { ts } = require('../config');


router.get('/', function (req, res, next)  {
    var response = {
        provider: 'Tradestation',
        name: 'Samir Desai',
        profile: ts.session_data
    }
    res.send(response);
})

module.exports = router;