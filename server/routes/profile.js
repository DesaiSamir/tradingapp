var express = require('express');
var router = express.Router();
const helper = require('../utils/helpers');
const profile = require('../db/user_profile');

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


router.get('/ts_profile', async function  (req, res, next)  {

    const user_profile = await profile.getUserProfileByUserId(1, 1);
    
    // console.log({sessionBefore: req.session})
    if(user_profile){
        req.session = user_profile;
        // console.log({sessionAfter:req.session})
        res.send(user_profile);
    }
})

module.exports = router;