var db = require('../database');

//User object constructor
var Watchlist = function(record){
    this.watchlist_id = record.watchlist_id;
    this.symbol = record.symbol;
};

Watchlist.insertWatchlist = async function (newWatchlist) {
    const qp = newWatchlist;
    const query = `INSERT INTO watchlist (symbol)
    VALUES ('${qp.symbol}');`;
    
    const result = await db.crudData(query, newWatchlist);

    if(result){
        return result;
    }
    return null;
};

Watchlist.deleteWatchlist = async function (existingWatchlist) {
    const qp = existingWatchlist;

    const query = `DELETE FROM watchlist WHERE watchlist_id='${qp.watchlist_id}';`;
    
    const result = await db.crudData(query, existingWatchlist);
    if(result){
        return result;
    }
    return null;
};

Watchlist.getWatchlistBySymbol = async function (symbol) {
    const query = `Select * from watchlist where symbol='${symbol}';`;
    
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return null;
};

Watchlist.getAllWatchlist = async function () {
    const query = `Select * from vw_watchlist;`;
    
    const result = await db.getData(query);

    if(result){
        return result;
    }
    return null;
};

Watchlist.getDayTradeWatchlist = async function () {
    const query = `Select * from vw_watchlist WHERE day_trade = true;`;
    
    const result = await db.getData(query);

    if(result){
        return result;
    }
    return null;
};

Watchlist.toggleDayTradeBySymbol = async function (symbol) {
    const query = `UPDATE watchlist SET day_trade = CASE WHEN day_trade = 1 THEN 0 ELSE 1 END where symbol='${symbol}';`;
    
    const result = await db.getData(query);

    if(result){
        return result[0];
    }
    return null;
};

Watchlist.saveWatchlist = async function (payload) {
    const newWatchlistPayload = new Watchlist({
        symbol: payload.Symbol,
    });

    const watchlistExists = await this.getWatchlistBySymbol(payload.Symbol);

    if(!watchlistExists) {
        const newWatchlist = await this.insertWatchlist(newWatchlistPayload);
        if(newWatchlist){
            return newWatchlist;
        }
    } 
};


module.exports = Watchlist;