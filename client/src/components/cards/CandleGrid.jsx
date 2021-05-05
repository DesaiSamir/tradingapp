import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Paper, Typography, ButtonBase 
} from '@material-ui/core';
import MiniCandlestick from '../displays/MiniCandlestick';
import helper from '../../utils/helper';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';
import { OrderContext } from '../../contexts/OrderProvider';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
    },
    symbol: {
        width: 100,
        height: 80,
    },
    miniChart: {
        margin: 'auto',
        width: 60,
        height: 60,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    font: {
        fontWeight: 'bold',
    },
}));

export default function CandleGrid({candles}) {
    const classes = useStyles();
    const { setSymbolText } = useContext(ChartActionsContext);
    const { handleClickOpenTradeDialog } = useContext(OrderContext);
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item >
                        <ButtonBase className={classes.symbol} onClick={() => setSymbolText(candles[1])}>
                            <Typography variant="h4" component="h2">
                                {candles[1].symbol}
                            </Typography>
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container onClick={() => handleClickOpenTradeDialog(candles[1])}>
                        <Grid item xs container spacing={1}>
                            <Grid item xs={12} container spacing={1}>
                                <Grid item xs={5}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        {candles[1].title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Pattern:
                                    </Typography>
                                </Grid>                                
                                <Grid item xs={4}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {candles[1].pattern}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Open:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candles[1].open).toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Close:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candles[1].close).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        High:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candles[1].high).toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Low:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candles[1].low).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                    TimeStamp:
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {new Date(candles[1].date).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Paper className={classes.miniChart}>
                                    {
                                        (candles) ? 
                                            <MiniCandlestick data={helper.getMiniChartCandles(candles)} />
                                        : <div>Loading...</div>
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
