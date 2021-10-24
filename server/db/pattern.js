var db = require('../database');

var Pattern = function(record){
    this.pattern_name = record.pattern_name;
    this.pattern_type = record.pattern_type;
}

var IntradayPattern = function(record){
    this.pattern_name = record.pattern_name;
    this.symbol = record.symbol;
    this.timeframe = record.timeframe;
    this.c_open = record.c_open;
    this.c_high = record.c_high;
    this.c_low = record.c_low;
    this.c_close = record.c_close;
    this.c_date = record.c_date;
    this.candles = record.candles;
}

Pattern.getPatterns = async function(){
    const query = `SELECT pattern_id as id, pattern_name as title, pattern_type FROM patterns ORDER BY pattern_type, title;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null;
}

var pattern_types;
Pattern.getPatterns().then(data => { pattern_types = data});

Pattern.getTimeframes = async function(){
    const timeframes = [
        {
            id: 1,
            title: 'All',
        },
        {
            id: 2,
            title: '5M',
        },
        {
            id: 3,
            title: '15M',
        },
        {
            id: 4,
            title: '60M',
        },
        {
            id: 5,
            title: 'Daily',
        },
        {
            id: 6,
            title: 'Weekly',
        },
        {
            id: 7,
            title: 'Monthly',
        },
    ];
    if(timeframes){
        return timeframes;
    }
    return null;
}

Pattern.insertPattern = async function(newPattern){
    const qp = newPattern;
    const query = `INSERT INTO (pattern_name, pattern_type) 
                    VALUES('${qp.pattern_name}', '${qp.pattern_type}')`
    const result = await db.crudData(query, newPattern);
    
    if(result){
        return result;
    }
    return null;
}

Pattern.getAllPatterns = async function (){
    const query = `SELECT * FROM vw_intraday_patterns;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null; 
}

Pattern.getIntradayPatterns = async function (){
    const query = `SELECT * FROM vw_intraday_patterns WHERE timeframe NOT IN ('Daily', 'Weekly', 'Monthly') ;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null; 
}

Pattern.getDailyPatterns = async function (){
    const query = `SELECT * FROM vw_intraday_patterns WHERE timeframe IN ('Daily', 'Weekly', 'Monthly') ;`
    const result = await db.getData(query);
    
    if(result){
        return result;
    }
    return null; 
}

Pattern.getIntradayPatternIfExist = async function (newIntradayPattern){
    const qp = newIntradayPattern;
    const pattern_id = pattern_types.filter(p => p.title === qp.pattern_name)[0].id;
    const query = `SELECT symbol, timeframe, 
                    c_open, c_high, c_low, c_close, c_date, candles 
                    FROM intraday_patterns ip 
                    WHERE symbol='${qp.symbol}' AND timeframe='${qp.timeframe}' AND pattern_id=${pattern_id} AND c_date=STR_TO_DATE('${qp.c_date}','%Y-%m-%dT%H:%i:%s.000Z');`
    const result = await db.getData(query);
    
    if(result){
        return true;
    }
    return null; 
}

Pattern.updatePatternIfHasOrder = async function(symbols){
    var query = `UPDATE intraday_patterns ip
                SET ip.has_active_order = 1
                WHERE symbol IN (${symbols});`
    var result = await db.crudData(query, {});

    if(result){
        return result;
    }

    return null; 
}

Pattern.updatePatternIfHasOrderBySymbol = async function(symbol){
    var query = `UPDATE intraday_patterns ip
                SET ip.has_active_order = 1
                WHERE symbol = '${symbol}';`
    var result = await db.crudData(query, {});

    if(result){
        return result;
    }

    return null; 
}

Pattern.updatePatternIfHasPosition = async function(symbols){
    var query = `UPDATE intraday_patterns ip
                LEFT JOIN (SELECT symbol, 1 has_active_position 
                            FROM vw_intraday_patterns 
                            WHERE symbol IN (${symbols.length > 0 ? symbols : '""' })) vip ON vip.symbol = ip.symbol
                SET ip.has_active_position = COALESCE(vip.has_active_position, 0);`
    var result = await db.crudData(query, {});

    if(result){
        return result;
    }

    return null; 
}

Pattern.insertIntradayPatterns = async function (newIntradayPattern){
    const qp = newIntradayPattern;
    const pattern_id = pattern_types.filter(p => p.title === qp.pattern_name)[0].id;
    const query = `INSERT INTO tradingapp.intraday_patterns
                    (symbol, pattern_id, timeframe, c_open, c_high, c_low, c_close, c_date, candles)
                    VALUES('${qp.symbol}', ${pattern_id}, '${qp.timeframe}', 
                            '${qp.c_open}', '${qp.c_high}', '${qp.c_low}', '${qp.c_close}', STR_TO_DATE('${qp.c_date}','%Y-%m-%dT%H:%i:%s.000Z'), '${qp.candles}');`
    const result = await db.crudData(query, newIntradayPattern);
    
    if(result){
        return result;
    }
    return null; 
}

Pattern.deleteIntradayPatterns = async function(){
    const query = `DELETE FROM intraday_patterns WHERE created > CURRENT_DATE() - 1;`

    const result = await db.crudData(query, {});
    
    if(result){
        return result;
    }
    return null;
}

Pattern.deleteIntradayPatternsBySymbol = async function(symbol){
    const query = `DELETE FROM intraday_patterns WHERE symbol='${symbol}';`

    const result = await db.crudData(query, {symbol:symbol});
    
    if(result){
        return result;
    }
    return null;
}

Pattern.addNewPatterns = async function(patterns){
    // console.log(patterns);
    patterns.forEach(async function(p) {
        const newIntradayPattern = new IntradayPattern({            
            pattern_name: p.pattern_name,
            pattern_type: p.pattern_type,
            symbol: p.symbol,
            timeframe: p.timeframe,
            c_open: parseFloat(p.c_open).toFixed(2),
            c_high: parseFloat(p.c_high).toFixed(2),
            c_low: parseFloat(p.c_low).toFixed(2),
            c_close: parseFloat(p.c_close).toFixed(2),
            c_date: p.c_date,
            candles: JSON.stringify(p.candles)
        });

        const patternExist = await this.getIntradayPatternIfExist(newIntradayPattern);
        if(!patternExist){

            this.insertIntradayPatterns(newIntradayPattern);
            
        }
    }, this);
    
    return (patterns);
}

module.exports = Pattern;