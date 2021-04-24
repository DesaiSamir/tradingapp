var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');

router.get('/', async function  (req, res, next)  {
    if(req.session && req.session.expires_in) {
        const currentDT = new Date();
        if(new Date(req.session.expires_in) < currentDT){
            const sessionInfo = await helper.refreshToken(req, res);
            if(sessionInfo){
                
                helper.returnResponse(req, res);
            }
        }
        else {
            helper.returnResponse(req, res);
        }
    } else {
        res.redirect('/');
    };
})

module.exports = router;