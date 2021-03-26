const fetch = require('node-fetch');
const { ts } = require('../config');

module.exports = {
    getAccessToken: async function (req, code, refresh_token){
        var redirect_uri = `http://${req.headers.host}${ts.api_callback}`;
        var payload = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${ts.client_id}&client_secret=${ts.client_secret}`
    
        if(refresh_token){
            payload = `grant_type=refresh_token&redirect_uri=${redirect_uri}&client_id=${ts.client_id}&client_secret=${ts.client_secret}&refresh_token=${refresh_token}&reponse_type=token`
        }
    
        const reqLen = payload.length
        
        const res = await fetch(`${ts.base_url}/security/authorize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": reqLen
            },
            body: payload
        })
        
        const token_info = await res.json()
        // const token_info = this.post(`${ts.base_url}/security/authorize`, payload);
    
        if(token_info){
            var now = new Date()
            req.session.userid = token_info.userid
            req.session.refreshed_at = new Date()
            req.session.expires_in = new Date(now.setSeconds(now.getSeconds() + token_info.expires_in))
            req.session.access_token = token_info.access_token
            req.session.refresh_token = token_info.refresh_token
            ts.session_data = req.session;
        }
        
        return token_info
    },
    
    getUser: function(){
        const user_data = this.get(`/users/${ts.session_data.userid}/accounts`);
        return user_data
    },

    get: function(url) {
        return this.send('GET', url);
    },

    post: function(url, payload) {
        return this.send('POST', url, payload);
    },

    send: async function(method, url, payload = null) {
        var req;
        switch (method) {
            case 'GET':
                req = await fetch(`${ts.base_url}${url}`, {
                    headers: {
                        Authorization: `bearer ${ts.session_data.access_token}`
                    }
                });
                break;

            case 'POST':
                const payloadLen = payload.length;
                // console.log({url, payloadLen, payload});
                req = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Content-Length": payloadLen
                    },
                    body: payload
                });
            default:
                break;
        }
        const res = await req.json();
        
        return res;
    }

}