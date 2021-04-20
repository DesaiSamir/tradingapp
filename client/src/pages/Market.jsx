import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import _ from "lodash";
import StockChart from "../components/displays/BasicCandlestick";
import FormDialog from "../components/formcontrols/FormDialog";
import CandleGrid from "../components/cards/CandleGrid";
import WatchlistGrid from "../components/cards/WatchlistGrid";
import http from '../utils/http';
import { 
    Paper, Grid, Typography 
} from "@material-ui/core";

const Market = ({url, barChartData = [], chartText, setSymbol, symbol}) => {
    const classes = useStyles();
    const [currentWatchlist, setCurrentWatchlist] = useState([]);
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";

    var patternCandles = [];
    if(barChartData.length > 0){
        const chartData = _.clone(barChartData);
        chartData.reverse();
        var lastClosedCandle, lastBullilshCandle, lastBearishCandle;
        var lastCandles = [], lastBullCandles = [], lastBearCandles = [];

        lastClosedCandle = chartData[0];
        lastClosedCandle = {...lastClosedCandle, title: 'Current Candle'}
        lastCandles.push(chartData[1]);
        lastCandles.push(lastClosedCandle);
        patternCandles.push(lastCandles);

        const lastBullishIndex = chartData.findIndex(candle=> candle.isBullishEngulfing);
        lastBullilshCandle = chartData[lastBullishIndex];
        lastBullilshCandle = {...lastBullilshCandle, title: 'Last Bullish Candle'}
        lastBullCandles.push(chartData[lastBullishIndex + 1]);
        lastBullCandles.push(lastBullilshCandle);
        patternCandles.push(lastBullCandles);

        const lastBearishIndex = chartData.findIndex(candle=> candle.isBearishEngulfing);
        lastBearishCandle = chartData[lastBearishIndex];
        lastBearishCandle = {...lastBearishCandle, title: 'Last Bearish Candle'}
        lastBearCandles.push(chartData[lastBearishIndex + 1]);
        lastBearCandles.push(lastBearishCandle);
        patternCandles.push(lastBearCandles);
    }
    useEffect(() => {
        
        http.getWatchlistRecursive(setCurrentWatchlist);
        
    }, []);

    if(currentWatchlist.length === 0){
        http.getWatchlist(setCurrentWatchlist);
    }
    const handleAddWatchlist = async (e, setOpen) => {
        if (e.type === 'keydown' && e.key !== 'Enter') return;
        e.preventDefault();
        var stockSymbol = document.getElementById('addStockSymbol');
        http.clearQuoteInterval();
        const payload = { 
            Symbol: stockSymbol.value,
        };

        const addedSymbol = await http.send('POST','api/watchlist', payload);

        if(addedSymbol){
            console.log(addedSymbol);
            const newSymbol = {
                Symbol: addedSymbol.symbol
            };
            setCurrentWatchlist([...currentWatchlist,  newSymbol]);
        }
        setOpen(false);
    }

    const handleDeleteWatchlist = async (e, stock) => {
        e.preventDefault();
        // console.log(stock.Symbol)
        const payload = { 
            Symbol: stock.Symbol,
        };
        const deleteSymbol = await http.send('DELETE',`api/watchlist/${stock.Symbol}`, payload);
    
        if(deleteSymbol){
            http.getWatchlist(setCurrentWatchlist);
        }
    }

    const onListItemClick = (e, data) => {
        e.preventDefault();
        var symbolText = document.getElementById('symbol');
        symbolText.value = data.Symbol;
        setSymbol(data.Symbol);
    }

    return (
        <div className={classes.root} >
            <Grid container>
                <Grid item xs={4}> 
                    <Grid container>
                        <Grid item xs={12} className={classes.watchlistContainer}> 
                            <Paper className={`${classes.watchlistBar} ${classes.head}`}>
                                <Typography variant="h5" component="h2" className={classes.title}>
                                    Watchlist
                                </Typography>
                                <FormDialog handleClick={handleAddWatchlist}/>
                            </Paper>
                            <Paper className={classes.stockList} >
                                {currentWatchlist && currentWatchlist.length > 0 && currentWatchlist.map((stock) => (
                                    <Paper className={classes.watchlistItem}  key={stock.Symbol} >
                                        <WatchlistGrid 
                                            stock={stock}
                                            onListItemClick={onListItemClick}
                                            handleDeleteWatchlist={handleDeleteWatchlist}
                                        />
                                    </Paper >
                                ))}
                            </Paper>
                        </Grid>
                        
                        <Grid item xs={12} className={classes.watchlistContainer}> 
                            <Paper className={`${classes.watchlistBar} ${classes.head}`}>
                                <Typography variant="h6" component="h2" className={classes.title}>
                                    Patterns for: {chartText}
                                </Typography>
                                {/* <FormDialog handleClick={handleClick}/> */}
                            </Paper>
                            <Paper>
                                {patternCandles && patternCandles.length > 0 && patternCandles.map((candles) => (
                                    <Paper key={candles[1].title}>
                                        <CandleGrid 
                                            candles={candles}
                                            symbol={symbol} 
                                        />
                                    </Paper>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={8}>
                    <Grid container >
                        <Grid item xs={12} id="timeframes" className={classes.head}>
                            TimeFrames
                        </Grid>
                        <Grid item xs={12}>
                            {
                                (barChartData && barChartData.length > 0) ? 
                                    <StockChart dateTimeFormat={dateTimeFormat} data={barChartData} chartText={chartText} />
                                : <div>Loading...</div>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
export default Market

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "5px",
        height: window.innerHeight - 122,
        overflow: "hidden",
    },
	spacer: {
        marginTop: "5px",
	},
    stockList:{
        height: `calc(100% - 62px)`,
    },
    watchlistBar:{
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {
        padding: '16px',
    },
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    watchlistItem: {
        cursor: 'pointer',
    },
    watchlistContainer: {
        overflowY: 'auto',
        height: (window.innerHeight - 122)/2,
    }
}));

