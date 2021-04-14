import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StockChart from "../components/displays/BasicCandlestick";
import FormDialog from "../components/formcontrols/FormDialog";
import http from '../utils/http';
import { 
    Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography 
} from "@material-ui/core";
import { watchlist } from "../data/watchlist";

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
        // backgroundColor: theme.palette.action.hover,
        },
        cursor: 'pointer',
    },
}))(TableRow);

const Market = ({url, barChartData, chartText, setSymbol}) => {
    const classes = useStyles();
    const [currentWatchlist, setCurrentWatchlist] = useState(watchlist);
    
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";

    useEffect(() => {           
        const stocks =  Array.prototype.map.call(currentWatchlist, s => s.Symbol).toString();    
        http.getQuoteDataRecursive({ method: 'GET', url: `/v2/data/quote/${stocks}`}, setCurrentWatchlist);
    }, [currentWatchlist]);

    const handleClick = (e, setOpen) => {
        if (e.type === 'keydown' && e.key !== 'Enter') return;
        e.preventDefault();
        var stockSymbol = document.getElementById('addStockSymbol');
        http.clearQuoteInterval();
        const addSymbol = { 
            Symbol: stockSymbol.value,
        };
        setCurrentWatchlist([...currentWatchlist,  addSymbol]);
        setOpen(false);
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
                <Grid item xs={2}> 
                    <Paper className={classes.watchlistBar}>
                        <Typography variant="h5" component="h2" className={classes.title}>
                            Watchlist
                        </Typography>
                        <FormDialog handleClick={handleClick}/>
                    </Paper>
                    <Paper className={classes.stockList}>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Symbol</StyledTableCell>
                                        <StyledTableCell align="right">Last Price</StyledTableCell>
                                        <StyledTableCell align="right">Previous Close</StyledTableCell>
                                        <StyledTableCell align="right">VWAP</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentWatchlist && currentWatchlist.length > 0 && currentWatchlist.map((stock) => (
                                        <StyledTableRow key={stock.Symbol} hover onClick={(e) => onListItemClick(e, stock)}>
                                            <StyledTableCell component="th" scope="row">
                                                {stock.Symbol}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{stock.LastPriceDisplay}</StyledTableCell>
                                            <StyledTableCell align="right">{stock.PreviousClosePriceDisplay}</StyledTableCell>
                                            <StyledTableCell align="right">{stock.VWAPDisplay}</StyledTableCell>
                                            
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={10}>
                    {
                        (barChartData && barChartData.length > 0) ? 
                            <StockChart dateTimeFormat={dateTimeFormat} data={barChartData} chartText={chartText} />
                        : <div>Loading...</div>
                    }
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
}));

