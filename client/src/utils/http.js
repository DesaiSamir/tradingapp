var patterns = require('./patterns');

var barChartTimer, watchlistTimer, patternsTimer, quoteTimer, ordersInterval, positionsInterval, balancesInterval;
var currentSymbol, currentUrl, patternIntradayTimer, overrideSession = false, regularSession = false;
module.exports = {
    clearBarChartInterval: function () {
        clearInterval(barChartTimer);
    },
    clearQuoteInterval: function () {
        clearInterval(quoteTimer);
    },
    getRefreshInterval: function () {
        if(this.isRegularSessionTime()){
            return 3000;
        }

        return 10000;
    },
    getGeneralRefreshInterval: function () {
        if(this.isRegularSessionTime()){
            return 5000;
        }

        return 10000;
    },
    overrideRegularSession: function (override) {
        overrideSession = override;        
    },
    isRegularSessionTime: function () {
        const sessionStartTime = new Date(new Date().toLocaleDateString() + " 9:30:00 AM");
        const sessionEndTime = new Date(new Date().toLocaleDateString() + " 4:00:00 PM");
        const currentTime = new Date();
        var currentSession = false;
        
        if ((currentTime > sessionStartTime && currentTime < sessionEndTime && currentTime.getDay() > 0 && currentTime.getDay() < 6) || overrideSession) {
            currentSession = true;
        }

        if(currentSession !== regularSession){
            regularSession = currentSession;
            const payload = {
                setting_name: 'OverrideRegularSession',
                setting_value: this.isRegularSessionTime() ? 1 : 0
            }
            this.send('POST', 'api/settings', payload);
        }
        return currentSession;
    },
    getProfileData: async function (cb) {
        const profileData = await this.get('api/profile');
        if(profileData){
            console.log({profileData});
            cb(profileData);
        }
    },
    getQuoteData: async function (symbol, cb) {
        const quoteData = await this.get(`api/watchlist/${symbol}`);
        currentSymbol = symbol;
        if(quoteData){
            console.log({quoteData});
            cb(quoteData[0]);
        }
    },
    getQuoteDataRecursive: function (payload, cb) {
        
        clearInterval(quoteTimer);
        
        quoteTimer = setInterval(async () => {

            if(this.isRegularSessionTime()){
                const quoteData = await this.send('POST', 'api/marketdata', payload);
                if(quoteData){
                    cb(quoteData[0]);
                }
            }
        }, this.getRefreshInterval());
    },
    getBarChartData: async function (payload, cb, symbol) {
        const barData = await this.send('POST', 'api/marketdata', payload);
        currentUrl = payload.url;
        if(barData){
            var responseData = barData;
            if(responseData.length > 0){
                responseData = patterns.detectPattern(this.formatTSData(responseData));
            } else {
                responseData = {
                    status: "Error fetching data.", 
                    response: responseData,
                };
            } 
            console.log({barChartData: responseData});
            cb(responseData);
        }
        this.getBarChartDataRecursive(payload, cb, symbol);
    },
    getBarChartDataRecursive: function (payload, cb, symbol) {
        
        clearInterval(barChartTimer);
        
        barChartTimer = setInterval(async () => {
            if(this.isRegularSessionTime() || payload.url.indexOf(`USEQPreAndPost`) > 0){
                const barData = await this.send('POST', 'api/marketdata', payload);            
                if(barData && currentSymbol === symbol && currentUrl === payload.url){
                    var responseData = barData;
                    if(responseData.length > 0){
                        responseData = patterns.detectPattern(this.formatTSData(responseData));
                    } else {
                        responseData = {
                            status: "Error fetching data.", 
                            response: responseData,
                        };
                    } 
                    cb(responseData);
                }
            }
        }, this.getRefreshInterval());
    },
    getWatchlist: async function(cb){
        const watchlistData = await this.get("api/watchlist", cb);
        
        if(watchlistData){
            console.log({watchlistData});
            cb(watchlistData);
        }
        this.getWatchlistRecursive(cb);
    },
    getWatchlistRecursive: function(cb){
        
        clearInterval(watchlistTimer);
        
        watchlistTimer = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const watchlistData = await this.get("api/watchlist", cb);
                
                if(watchlistData){
                    cb(watchlistData);
                }
            }
        }, this.getRefreshInterval());
    },
    getPatterns: async function(cb){
        const patternData = await this.get("api/pattern", cb);
        
        if(patternData){
            console.log({patternData});
            cb(patternData);
        }
        this.getPatternsRecursive(cb);
    },
    getPatternsRecursive: function(cb){
        
        clearInterval(patternsTimer);
        
        patternsTimer = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const patternData = await this.get("api/pattern/intraday", cb);
                
                if(patternData){
                    cb(patternData);
                }
            }
        }, this.getRefreshInterval());
    },
    getPatternIntraday: async function(cb){
        const intradayData = await this.get("api/pattern/intraday", cb);
        
        if(intradayData){
            console.log({intradayData});
            cb(intradayData);
        }
        this.getPatternIntradayRecursive(cb);
    },
    getPatternIntradayRecursive: function(cb){
        
        clearInterval(patternIntradayTimer);
        
        patternIntradayTimer = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const patternData = await this.get("api/pattern/intraday", cb);
                
                if(patternData){
                    cb(patternData);
                }
            }
        }, 15000);
    },
    updatePatternsHasOrder: async function(payload){
        await this.send('PUT','api/pattern/hasorder', payload);
    },
    updatePatternsHasPosition: async function(payload){
        await this.send('PUT','api/pattern/hasposition', payload);
    },
    getPatternTimeframes: async function(cb){
        const timeframes = await this.get("api/pattern/timeframes", cb);
        
        if(timeframes){
            console.log({timeframes});
            cb(timeframes);
        }
    },
    getPatternTypes: async function(cb){
        const patternTypes = await this.get("api/pattern/types", cb);
        
        if(patternTypes){
            console.log({patternTypes});
            cb(patternTypes);
        }
        // this.getWatchlistRecursive(cb);
    },
    postPurchaseOrder: async function(payload, cb) {
        const purchaseOrder = await this.send('POST','api/orders', payload);
        if(purchaseOrder){
            cb({purchaseOrder, payload});
        }
    },
    updatePurchaseOrder: async function(payload, cb){
        const purchaseOrder = await this.send('PUT','api/orders', payload);
        if(purchaseOrder){
            cb(purchaseOrder);
        }
    },
    closePosition: async function(payload, cb){
        const purchaseOrder = await this.send('POST','api/orders/close', payload);
        if(purchaseOrder){
            cb(purchaseOrder);
        }
    },
    deletePurchaseOrder: async function(orderid, cb = null){

        const purchaseOrder = await this.send('DELETE', `api/orders/${orderid}`);
        if(purchaseOrder && cb){
            cb(purchaseOrder);
        }
    },
    getAccounts: async function(userid, cb){
        
        const accounts = await this.get(`api/accounts/${userid}`);

        if(accounts){
            cb(accounts);
        }
    },
    getAccountOrders: async function(key, cb){
        
        const orders = await this.get(`api/orders/${key}`);

        if(orders){
            console.log({orders});
            cb(orders);
        }
        this.getAccountOrdersRecursive(key, cb);
        
    },
    getAccountOrdersRecursive: function(key, cb){

        clearInterval(ordersInterval);

        ordersInterval = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const orders = await this.get(`api/orders/${key}`);

                if(orders){
                    cb(orders);
                }
            }
        }, 2500);
    },
    getAccountPositions: async function(key, cb){

        const positions = await this.get(`api/accounts/positions/${key}`);

        if(positions){
            console.log({positions});
            cb(positions);
        }

        this.getAccountPositionsRecursive(key, cb);
    },
    getAccountPositionsRecursive: function(key, cb){
        
        clearInterval(positionsInterval);

        positionsInterval = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const positions = await this.get(`api/accounts/positions/${key}`);

                if(positions){
                    cb(positions);
                }
            }
        }, this.getGeneralRefreshInterval());
    },
    getAccountBalances: async function(key, cb){

        const balances = await this.get(`api/accounts/balances/${key}`);

        if(balances){
            console.log({balances});
            cb(balances);
        }

        this.getAccountBalancesRecursive(key, cb);
    },
    getAccountBalancesRecursive: async function(key, cb){

        clearInterval(balancesInterval);

        balancesInterval = setInterval(async () => {
            if(this.isRegularSessionTime()){
                const balances = await this.get(`api/accounts/balances/${key}`);

                if(balances){
                    cb(balances);
                }
            }
        }, this.getGeneralRefreshInterval());
    },
    send: async function (method, url, payload = null) {
        // console.log({method, url, payload});
        var options = {
            method: method,
            headers: {
                'Content-type': 'application/json'
            },
            body: payload && JSON.stringify(payload)
        };
        
        // console.log({options, url})

        const data = await fetch(url, options)
            .then(res => res.json())
            .then(data => {
                return data;
            })
            .catch(err => console.log({err})

        );
        if(data){
            return data;
        }
        
    },
    formatTSData: function (data){
        var formatedData = [];
        const tsRegX = /\d+/g;
        // console.log(data)
        data.forEach(dataPoint => {
            if(dataPoint.TimeStamp){
                const ts = parseInt(dataPoint.TimeStamp.match(tsRegX)[0]);
                const date = new Date(ts);
                if(dataPoint.Open > 0){
                    formatedData.push({
                        date,
                        open: parseFloat(dataPoint.Open),
                        high: parseFloat(dataPoint.High),
                        low: parseFloat(dataPoint.Low),
                        close: parseFloat(dataPoint.Close),
                        volume: parseInt(dataPoint.TotalVolume),
                        dividend: "",
                        absoluteChange: "",
                        percentChange: "",
                        split: "",
                        pattern: ""
                    });
                }
            }
        })

        return formatedData.sort((a, b) => (a.date > b.date) ? 1 : -1);
    },
    get: async function (url) {
        const res = await fetch(url)
            .then(res => res.json())
            .then(res => {
                return res
            })
            .catch(err => {
                if(url.indexOf('profile') > 0){
                    console.log('Login expired!')
                } else {
                    console.log({err})
                }
            });

        if(res){
            return res;
        }
    },
    getSettings: async function(cb){
        const settings = await this.get('api/settings');
        
        if(settings){
            console.log({settings});
            cb(settings);
        }
    },
    getSettingUnits: async function(cb){
        const units = await this.get('api/settings/units');
        
        if(units){
            console.log({units});
            cb(units);
        }
    },
    saveSettings: async function(payload, cb){
        const settings = await this.send('PUT', 'api/settings', payload);
        
        if(settings){
            cb(settings);
        }
    },
    getUserSettings: async function(username,cb){
        const userSettings = await this.get(`api/usersettings/${username}`);
        
        if(userSettings){
            console.log({userSettings});
            cb(userSettings);
        }
    },
};

