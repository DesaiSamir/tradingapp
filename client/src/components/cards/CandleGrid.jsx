import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Paper, Typography, ButtonBase, IconButton, Button 
} from '@material-ui/core';
import MiniCandlestick from '../displays/MiniCandlestick';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import helper from '../../utils/helper';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';
import { OrderContext } from '../../contexts/OrderProvider';
import { PatternContext } from '../../contexts/PatternProvider';


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
    sendOrder: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeframe: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    button: {
        width: '100%',
        padding: '3px 6px',
    },
    font: {
        fontWeight: 'bold',
    },
}));

export default function CandleGrid({candles}) {
    const candleInAction = candles[1];
    const classes = useStyles();
    const { 
        setSymbolTextFromCandle, currentWatchlist, addFavWatchlist, handleDeleteWatchlist, 
    } = useContext(ChartActionsContext);
    const { handleClickOpenTradeDialog } = useContext(OrderContext);
    const { 
        handleRemovePattern, 
    } = useContext(PatternContext);

    const isFavorite = (
        <>
        { currentWatchlist.some(s => s.Symbol === candleInAction.symbol)
            ? <FavoriteIcon onClick={() => handleDeleteWatchlist(candleInAction.symbol)}/>
            : <FavoriteBorderIcon onClick={() => addFavWatchlist(candleInAction.symbol)}/>
        }
        </>
    );

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item className={classes.timeframe}>
                        <ButtonBase className={classes.symbol} onClick={() => setSymbolTextFromCandle(candleInAction)}>
                            <Typography variant="h4" component="h2">
                                {candleInAction.symbol}
                            </Typography>
                        </ButtonBase>
                        <Typography variant="button" display="block" gutterBottom className={classes.font}>
                            {candleInAction.timeframe}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container spacing={1}>
                            <Grid item xs={12} container spacing={1}  className={classes.sendOrder}>
                                <Grid item xs={6} onClick={() => setSymbolTextFromCandle(candleInAction)}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        {candleInAction.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button variant="contained" color="secondary" className={classes.button} onClick={() => handleClickOpenTradeDialog(candleInAction)}>
                                        Send Order
                                    </Button>
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton
                                        className={classes.iconButton}
                                        edge='end'
                                        color='secondary'
                                    >
                                        {isFavorite}
                                    </IconButton>
                                    <IconButton
                                        className={classes.iconButton}
                                        edge='end'
                                        color='secondary'
                                        onClick={() => handleRemovePattern(candleInAction)}
                                    >
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} container onClick={() => setSymbolTextFromCandle(candleInAction)}>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Open:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candleInAction.open).toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Close:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candleInAction.close).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} container onClick={() => setSymbolTextFromCandle(candleInAction)}>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        High:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candleInAction.high).toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Low:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(candleInAction.low).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} onClick={() => setSymbolTextFromCandle(candleInAction)}>
                                <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                    TimeStamp:
                                </Typography>
                                <Typography variant="button" gutterBottom>
                                    {new Date(candleInAction.date).toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} onClick={() => setSymbolTextFromCandle(candleInAction)}>
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
