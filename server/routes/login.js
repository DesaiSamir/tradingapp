var express = require('express');
var router = express.Router();
const { ts } = require('../config');
const helper = require('../utils/helpers');

router.get('/', async function (req, res, next)  {

    var redirect_uri = `http://${req.headers.host}${ts.api_callback}`;
    var url = `${ts.base_url}/v2/authorize?response_type=code&state=&client_id=${ts.client_id}&scope=&redirect_uri=${redirect_uri}`;
    
    if(req.session && req.session.expires_in) {
        const sessionInfo = await helper.login(req);
        if(sessionInfo){
            res.send(req.session);
        }
    } else {
        res.redirect(url);
    };
})

router.get('/callback', async function (req, res, next)  {

    const code = req.query.code;
    
    const token_info = await helper.getAccessToken(req, code, null);

    const user_data = await helper.getUser(req);

    if(user_data){
        ts.session_data.user_data = user_data;
        res.redirect('/');
    } else {
        console.log('Error');
        res.send('Error happend');
    }
})

module.exports = router;