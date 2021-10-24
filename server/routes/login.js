var express = require('express');
var router = express.Router();
const { ts } = require('../config');
const helper = require('../utils/helpers');

router.get('/', async function (req, res, next)  {
    try {
        
        var redirect_uri = `http://${req.headers.host}${ts.api_callback}`;
        var url = `${ts.base_url}/v2/authorize?response_type=code&client_id=${ts.client_id}&redirect_uri=${redirect_uri}`;
        
        if(req.session && req.session.expires_in) {
            const sessionInfo = await helper.login(req, res);
            if(sessionInfo){
                res.send(req.session);
            }
        } else {
            console.log(url)
            res.redirect(url);
        };
        
    } catch (error) {
        console.log(error);       
    }
})

router.get('/callback', async function (req, res, next)  {

    const code = req.query.code;
    
    const token_info = await helper.getAccessToken(req, res, code, null);

    if(token_info){
        res.redirect('/');
    } else {
        console.log('Error');
        res.send('Error happend');
    }
})

module.exports = router;