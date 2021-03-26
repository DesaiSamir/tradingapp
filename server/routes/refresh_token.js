var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');


router.get('/', async function (req, res, next)  {

    if(req.session && req.session.expires_in) {
        if(new Date(req.session.expires_in) < new Date()){
            const token_info = await helper.getAccessToken(req, null, req.session.refresh_token)
        } 
        res.redirect('/profile')
    } else {
        res.redirect('/api/login')
    }
})

module.exports = router;