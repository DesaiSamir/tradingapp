var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next)  {
    res.send({profile: req.session});
})

module.exports = router;