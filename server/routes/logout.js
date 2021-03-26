var express = require('express');
var router = express.Router();
const { ts } = require('../config');


router.get('/', function (req, res, next)  {

    req.session = null
    ts.session_data = null;
    res.redirect('/')
})

module.exports = router;