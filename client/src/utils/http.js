module.exports = {
    send: async function (payload, cb) {
        var options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        
        const data = await fetch("api/marketdata", options)
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => console.log({err})
        );
        
        if(data){
            cb(data);            
        }
    },

    get: async function (url, cb) {
        const res = await fetch(url)
            .then(res => res.json())
            .then(res => {
                return res
            })
            .catch(err => console.log({err})
        );

        if(res){
            cb(res);
        }
    }
};

