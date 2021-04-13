import React, { 
    // useState, 
    // useEffect 
} from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import StockChart from "../components/displays/BasicCandlestick";
import SimpleTextField from '../components/formcontrols/SimpleTextField';
import SimpleSelect from "../components/formcontrols/SimpleSelect";
import DatePicker from "../components/formcontrols/DatePicker";
import SimpleButton from "../components/formcontrols/SimpleButton";
import http from '../utils/http';
import { 
    Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Fab 
} from "@material-ui/core";
import { watchlist } from "../data/watchlist";
import AddIcon from '@material-ui/icons/Add';

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

const handleClick = (e) => {
    e.preventDefault();
    console.log(e);
}

const Market = ({url, userData, stockQuote, barChartData, symbol, chartText, onTextChanged, onSelectChange, onDateChange, setSymbol}) => {
    const classes = useStyles();
    
    // useEffect(() => {
        
    // }, []);
    
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";
    const units = [
        {
            id: 1, 
            title: 'Minute',
            value: 'Minute'
        },
        {
            id: 2, 
            title: 'Daily',
            value: 'Daily'
        },
        {
            id: 3, 
            title: 'Weekly',
            value: 'Weekly'
        },
        {
            id: 4, 
            title: 'Monthly',
            value: 'Monthly'
        }
    ];

    const intervals = [
        {
            id: 1, 
            title: 1,
            value: 1
        }, 
        {
            id: 5, 
            title: 5,
            value: 5
        }, 
        {
            id: 10, 
            title: 10,
            value: 10
        }, 
        {
            id: 15, 
            title: 15,
            value: 15
        }, 
        {
            id: 30, 
            title: 30,
            value: 30
        }, 
        {
            id: 60, 
            title: 60,
            value: 60
        }, 
        {
            id: 240, 
            title: 240,
            value: 240
        }, 
        {
            id: 480, 
            title: 480,
            value: 480
        }
    ];

    const onListItemClick = (e, data) => {
        e.preventDefault();
        console.log(data);
        var symbolText = document.getElementById('symbol');
        symbolText.value = data.symbol;
        setSymbol(data.symbol);
    }

    return (
        <div className={classes.root} >
            <Grid container>
                <Grid item xs={2}> 
                    <Paper className={classes.watchlistBar}>
                        <Typography variant="h5" component="h2" className={classes.title}>
                            Watchlist
                        </Typography>
                        <Fab color="primary" aria-label="add" onClick={handleClick} className={classes.buttonStyle}>
                            <AddIcon />
                        </Fab>
                        {/* <IconButton
                            href=""
                            className={classes.buttonStyle}
                            // style={{ color: "white", }}
                            onClick={handleClick}
                        >
                            <AddIcon  />
                        </IconButton> */}
                    </Paper>
                    <Paper className={classes.stockList}>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Symbol</StyledTableCell>
                                        <StyledTableCell align="right">Previous Close</StyledTableCell>
                                        <StyledTableCell align="right">High 52w</StyledTableCell>
                                        <StyledTableCell align="right">Low 52w</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {watchlist.map((stock) => (
                                        <StyledTableRow key={stock.symbol} hover onClick={(e) => onListItemClick(e, stock)}>
                                            <StyledTableCell component="th" scope="row">
                                                {stock.symbol}
                                            </StyledTableCell>
                                            <StyledTableCell align="right">{stock.previousClose}</StyledTableCell>
                                            <StyledTableCell align="right">{stock.high52Week}</StyledTableCell>
                                            <StyledTableCell align="right">{stock.low52Week}</StyledTableCell>
                                            
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={10}>
                    <Paper className={classes.formcontrols}>
                        <SimpleTextField id="symbol" label="Symbol" name="symbol" onChange={onTextChanged} defaultValue={symbol} />
                        <SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="unit" menuItems={units} title="Select Unit" defaultValue="1" />
                        <SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="interval" menuItems={intervals} title="Select Interval" defaultValue={"15"} />
                        <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Last Date" name="lastDate" />
                        <SimpleTextField parentStyles={useStyles} id="daysBack" name="daysBack" label="Days Back" onChange={onTextChanged} defaultValue={"30"} type="number" />
                        <SimpleButton text="Stop Data" name="StopData" onClick={http.clearApiInterval} />
                    </Paper>
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
        // padding: theme.spacing(1),
    },
	formcontrols: {
		flexDirection: 'row',
        display: 'flex',
        width: '100%',
	},
    stockList:{
        // height: `calc(100% + 62px)`,
        height: '100%',
    },
    buttonText: {
        
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
    },
    watchlistBar:{
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {
        padding: '16px',
    },
    buttonStyle: {
        backgroundColor: "#26C6DA",
        // color: theme.palette.common.white,
        margin: '3px',
        // "&:hover": {
        //     color: "grey",
        // }
    },
}));

