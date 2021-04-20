const request = require('request');
const fetch = require('node-fetch');
const { ts, aa } = require('../config');
const db = require('./db_access');

module.exports = {
    getAccessToken: async function (req, res, code, refresh_token){
        var redirect_uri = `http://${req.headers.host}${ts.api_callback}`;
        var payload = `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}&client_id=${ts.client_id}&client_secret=${ts.client_secret}`
    
        if(refresh_token){
            payload = `grant_type=refresh_token&redirect_uri=${redirect_uri}&client_id=${ts.client_id}&client_secret=${ts.client_secret}&refresh_token=${refresh_token}&reponse_type=token`
        }
    
        const reqLen = payload.length
        
        const response = await fetch(`${ts.base_url}/v2/security/authorize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": reqLen
            },
            body: payload
        })
        
        const token_info = await response.json()
    
        if(token_info){
            var now = new Date()
            req.session.userid = token_info.userid
            req.session.refreshed_at = new Date()
            req.session.expires_in = new Date(now.setSeconds(now.getSeconds() + token_info.expires_in))
            req.session.refreshed_at_local = req.session.refreshed_at.toLocaleString()
            req.session.expires_in_local = req.session.expires_in.toLocaleString()
            req.session.access_token = token_info.access_token
            if(!refresh_token){
                req.session.refresh_token = token_info.refresh_token
            }
            req.session.provider = "Tradestation"
            req.session.name = "Samir Desai"
            req.session.alpha_advantage_key = aa.key
            ts.session_data = req.session;
            db.updateProviderUserInfo(req.session);
        }
        
        return token_info
    },

    login: async function(req, res){
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

    refreshToken: async function(req, res){
        if(req.session && req.session.expires_in) {
            const currentDT = new Date();
            if(new Date(req.session.expires_in) < currentDT){
                const token_info = await this.getAccessToken(req, res, null, req.session.refresh_token)
                if(token_info){
                    return req.session;
                }
            } else {
                return req.session;
            }
        }
    },

    returnResponse: function(req, res) {
        const sessionData = req.session;
        // db.updateProviderUserInfo(sessionData);
        res.send(sessionData);
    },
    
    getUserAccountInfo: function(req, res){
        const user_data = this.get(req, res,`/v2/users/${ts.session_data.userid}/accounts`);
        if(user_data){
            return user_data
        }
        return null;
    },

    get: async function(req, res, url) {
        return await this.send(req, res, 'GET', url);
    },

    post: async function(req, res, url, payload) {
        return await this.send(req, res, 'POST', url, payload);
    },

    send: async function(req, res, method, url, payload = null) {
        var tokenActive = false;
        if(req.session && req.session.expires_in) {
            const currentDT = new Date();
            if(new Date(req.session.expires_in) < currentDT){
                const sessionInfo = await this.refreshToken(req, res);
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
                            Authorization: `bearer ${req.session.access_token}`
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
                            'Authorization': `bearer ${req.session.access_token}`,
                            'Accept': 'application/vnd.tradestation.streams+json',
                            'Transfer-Encoding': 'chunked',
                            'Connection': 'keep-alive'
                        }
                    }).then(function (response) {
                        // console.log(response)
                        if (response.ok) {
                            return Promise.resolve(response.text())
                        } else {
                            return Promise.reject(new Error(response.statusText))
                        }
                    }).then(function (response) {

                        console.log(response)
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
        
                case 'STREAM':
                    
                    const client = () => new Promise((resolve) => {
                        const opts = {
                            method: 'GET',
                            timeout: 120000,
                            url: `${ts.base_url}${url}`,
                            headers: {
                                'Authorization': `bearer ${req.session.access_token}`,
                                'Accept': 'application/vnd.tradestation.streams+json',
                                'Transfer-Encoding': 'chunked',
                                'Connection': 'keep-alive'
                            }
                        };
                        const thisRequest = request(opts);
                    
                        thisRequest.on('response', (thisRes) => {
                            let data = '';
                            if (thisRes.statusCode !== 200) {
                                resolve(thisRes);
                            } else {
                    
                                thisRes.on('data', (chunk) => {
                                    data += chunk;
                                });
                        
                                thisRes.on('end', () => {
                                    // console.log(data)
                                    const lines = data.split(/\r?\n/);
                                    var retRes = [];
                                    lines.forEach((line) => {
                                        if(line.length > 0 && line !== "END")
                                            retRes.push(JSON.parse(line));
                                    });
                                    resolve(retRes);
                                });
                            }
                        });
                    
                        thisRequest.on('error', (error) => {
                            console.log({error})
                        });
                    });
                    const resData = await client();
                    if(resData){
                        return resData;
                    }
                    break;
                
                case 'CHUNK':
                    res = await fetch(`${ts.base_url}${url}`, {
                        headers: {
                            'Authorization': `bearer ${ts.session_data.access_token}`,
                            'Accept': 'application/vnd.tradestation.streams+json',
                            'Transfer-Encoding': 'chunked',
                            'Connection': 'keep-alive'
                        }
                    })
                    .then(processChunkedResponse)
                    .then(onChunkedResponseComplete)
                    .catch(onChunkedResponseError);

                    function onChunkedResponseComplete(result) {
                        // console.log('all done!', result)
                        const lines = result.split(/\r?\n/);
                        var retRes = [];
                        lines.forEach((line) => {
                            if(line !== "END")
                                retRes.push(JSON.parse(line));
                        });
                        return retRes;
                    }

                    function onChunkedResponseError(err) {
                        const error = {
                            message: err.message,
                            stack: err.stack
                        }
                        return (error)
                    }

                    async function  processChunkedResponse(response) {

                        if (!response.body[Symbol.asyncIterator]) {
                            response.body[Symbol.asyncIterator] = () => {
                              const reader = response.body.getReader();
                              return {
                                next: () => reader.read(),
                              };
                            };
                          }
                        let data = ''
                        for await (const result of response.body) {
                            data += result;
                        }

                        return data;
                    }
                    break;
                
                case 'POST':
                    payload = JSON.stringify(payload);
                    const postPayloadLen = payload.length;
                    console.log({method:'POST', url, postPayloadLen, payload});
                    res = await fetch(`${ts.base_url}${url}`, {
                        method: "POST",
                        headers: {
                            Authorization: `bearer ${req.session.access_token}`,
                            "Content-Type": "application/json; charset=utf-8",
                            'Accept': 'application/vnd.tradestation.streams+json',
                            "Content-Length": postPayloadLen
                        },
                        body: payload
                    })
                    .then(response => response.json())
                    .then((json) => {
                        return json;
                    });
                    // .then(async function (response) {
                        
                    //     if (!response.body[Symbol.asyncIterator]) {
                    //         response.body[Symbol.asyncIterator] = () => {
                    //           const reader = response.body.getReader();
                    //           return {
                    //             next: () => reader.read(),
                    //           };
                    //         };
                    //       }
                    //     let data = ''
                    //     for await (const result of response.body) {
                    //         data += result;
                    //     }

                    //     const result = {
                    //         status: response.status, 
                    //         statusText: response.statusText,
                    //         data: JSON.parse(data),
                    //         url: response.url, 
                    //         ok: response.ok,
                    //     }

                    //     return result;
                        
                    // })
                    // .catch(function (err) {
                    //     return {
                    //         message: err.message, 
                    //         stack: err.stack
                    //     };
                    // });
                    break;

                case 'PUT':
                    payload = JSON.stringify(payload);
                    const putPayloadLen = payload.length;
                    console.log({method:'PUT', url, payload});
                    res = await fetch(`${ts.base_url}${url}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `bearer ${req.session.access_token}`,
                            "Content-Type": "application/json; charset=utf-8",
                            'Accept': 'application/vnd.tradestation.streams+json',
                            "Content-Length": putPayloadLen
                        },
                        body: payload
                    })
                    .then(response => response.json())
                    .then((json) => {
                        return json;
                    });
                    // .then(async function (response) {
                    //     if (!response.body[Symbol.asyncIterator]) {
                    //         response.body[Symbol.asyncIterator] = () => {
                    //             const reader = response.body.getReader();
                    //             return {
                    //             next: () => reader.read(),
                    //             };
                    //         };
                    //         }
                    //     let data = ''
                    //     for await (const result of response.body) {
                    //         data += result;
                    //     }

                    //     const result = {
                    //         status: response.status, 
                    //         statusText: response.statusText,
                    //         data: JSON.parse(data),
                    //         url: response.url, 
                    //         ok: response.ok,
                    //     }

                    //     return result;
                        
                    // }).catch(function (err) {
                    //     return {
                    //         message: err.message, 
                    //         stack: err.stack
                    //     };
                    // });
                    break;

                case 'DELETE':
                    payload = JSON.stringify(payload);
                    console.log({method:'DELETE', url, payload});
                    res = await fetch(`${ts.base_url}${url}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `bearer ${req.session.access_token}`,
                            "Content-Type": "application/json; charset=utf-8",
                            'Accept': 'application/vnd.tradestation.streams+json'
                        }
                    })
                    .then(response => response.json())
                    .then((json) => {
                        return json;
                    });
                    // .then(async function (response) {
                    //     if (!response.body[Symbol.asyncIterator]) {
                    //         response.body[Symbol.asyncIterator] = () => {
                    //             const reader = response.body.getReader();
                    //             return {
                    //             next: () => reader.read(),
                    //             };
                    //         };
                    //         }
                    //     let data = ''
                    //     for await (const result of response.body) {
                    //         data += result;
                    //     }

                    //     const result = {
                    //         status: response.status, 
                    //         statusText: response.statusText,
                    //         data: JSON.parse(data),
                    //         url: response.url, 
                    //         ok: response.ok,
                    //     }

                    //     return result;
                        
                    // }).catch(function (err) {
                    //     return {
                    //         message: err.message, 
                    //         stack: err.stack
                    //     };
                    // });
                    break;

                default:
                    break;
            }
            
            return res;
        }
    }

}