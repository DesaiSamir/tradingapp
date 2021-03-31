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
        
        const res = await fetch(`${ts.base_url}/v2/security/authorize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": reqLen
            },
            body: payload
        })
        
        const token_info = await res.json()
    
        if(token_info){
            var now = new Date()
            req.session.userid = token_info.userid
            req.session.refreshed_at = new Date()
            req.session.expires_in = new Date(now.setSeconds(now.getSeconds() + token_info.expires_in))
            req.session.access_token = token_info.access_token
            if(!refresh_token){
                req.session.refresh_token = token_info.refresh_token
            }
            req.session.provider = "Tradestation"
            req.session.name = "Samir Desai"
            ts.session_data = req.session;
        }
        
        return token_info
    },

    login: async function(req){
        const currentDT = new Date();
        if(new Date(req.session.expires_in) < currentDT) { 
            const sessionInfo = await this.refreshToken(req);
            if(sessionInfo){
                return req.session;
            }
        } else {
            return req.session;
        };
    },

    refreshToken: async function(req){
        if(req.session && req.session.expires_in) {
            const currentDT = new Date();
            if(new Date(req.session.expires_in) < currentDT){
                const token_info = await this.getAccessToken(req, null, req.session.refresh_token)
                if(token_info){
                    return req.session;
                }
            } else {
                return req.session;
            }
        }
    },
    
    getUser: function(){
        const user_data = this.get(`/v2/users/${ts.session_data.userid}/accounts`);
        return user_data
    },

    get: async function(req, url) {
        return await this.send(req, 'GET', url);
    },

    post: async function(req, url, payload) {
        return await this.send(req, 'POST', url, payload);
    },

    send: async function(req, method, url, payload = null) {
        var tokenActive = false;
        if(req.session && req.session.expires_in) {
            const currentDT = new Date();
            if(new Date(req.session.expires_in) < currentDT){
                const sessionInfo = await this.refreshToken(req);
                if(sessionInfo){
                    tokenActive = true;
                }
            }
            tokenActive = true;
        } else {
            return {"Error": "Login expired, please login."};
        };

        if(tokenActive){
            var res;
            switch (method) {
                case 'GET':
                    res = await fetch(`${ts.base_url}${url}`, {
                        headers: {
                            Authorization: `bearer ${ts.session_data.access_token}`
                        }
                    }).then(function (response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return Promise.reject(response);
                        }
                    }).catch(function (err) {
                        const errRes = {
                            'status': err.status,
                            'statusText': err.statusText,
                            'url': err.url
                        }
                        return errRes;
                    });
                    break;

                case 'GETSTREAM':
                        res = await fetch(`${ts.base_url}${url}`, {
                            headers: {
                                'Authorization': `bearer ${ts.session_data.access_token}`,
                                'Accept': 'application/vnd.tradestation.streams+json'
                                // 'Transfer-Encoding': 'chunked'
                            }
                            // stream: true,
                            // arguments: {
                            //     'access_token': ts.session_data.access_token
                            // }
                        }).then(function (response) {
                            if (response.ok) {
                                return Promise.resolve(response.text())
                            } else {
                                return Promise.reject(new Error(response.statusText))
                            }
                        }).then(function (response) {

                            const lines = response.split(/\r?\n/);
                            var retRes = [];
                            lines.forEach((line) => {
                                if(line !== "END")
                                    retRes.push(JSON.parse(line));
                            });
                            return retRes;
                            
                        }).catch(function (err) {
                            const errRes = {
                                'status': err.status,
                                'statusText': err.statusText,
                                'url': err.url
                            }
                            return errRes;
                        });
                        
                        break;
        
                    
                case 'POST':
                    const payloadLen = payload.length;
                    // console.log({url, payloadLen, payload});
                    res = await fetch(url, {
                        method: "POST",
                        headers: {
                            Authorization: `bearer ${ts.session_data.access_token}`,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Content-Length": payloadLen
                        },
                        body: payload
                    });
                default:
                    break;
            }
            
            return res;
        }
    }

}