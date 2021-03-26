var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([
    {id:1, name:'Samir'},
    {id:2, name:'Darshana'},
    {id:3, name:'Saanvi'}
  ])
});

module.exports = router;
