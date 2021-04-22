import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {
	Paper, Dialog, DialogActions, DialogContent, DialogTitle, Grid, 
	ButtonBase, Typography
} from '@material-ui/core';
import CandleGrid from '../cards/CandleGrid';
import http from '../../utils/http';

const useStyles = makeStyles((theme) => ({
    buttonStyle: {
        backgroundColor: "#3f51b5",
        margin: '3px',
    },
    orderItem: {
        cursor: 'pointer',
    },
    orderContainer: {
        overflowY: 'auto',
        height: (window.innerHeight - 227),
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

export default function OrderDialog({userData, patternCandles, setOrderResponseData, setShowResponse}) {
	const [open, setOpen] = useState(false);
	const [candleInAction, setCandleInAction] = useState({
		date: new Date(),
		open: 0.00,
		high: 0.00,
		low: 0.00,
		close: 0.00,
		volume: 0,
		pattern: '',
		title: '',
		symbol: '',
		isBullishEngulfing: true,
		isBearishEngulfing: false,
	});
	const classes = useStyles();
	const handleClickOpen = (candles) => {
		setOpen(true);
		setCandleInAction(candles[1]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSendOrderClick = () => {
        const account = userData.user_data.filter(item => item.Type === 'M')[0];
		setOpen(false);
		if(candleInAction && candleInAction.symbol){
			const candleToExecute = candleInAction;
			var currentTime = new Date();
			const isBullish = candleToExecute.close > candleToExecute.open;
			const stopLimitAction = isBullish ? 'BUY' : 'SELLSHORT';
			const stopLossAction = isBullish ? 'SELL' : 'BUYTOCOVER';
			const stopPrice = parseFloat(isBullish ? candleToExecute.high + 0.01 : candleToExecute.low - 0.01).toFixed(2);
			const limitPrice = parseFloat(isBullish ? candleToExecute.high + 0.03 : candleToExecute.low - 0.03).toFixed(2);
			const stopLossPrice = parseFloat(isBullish ? candleToExecute.low - 0.01 : candleToExecute.high + 0.01).toFixed(2);
			const quantity = '1'

			const OrderConfirmId = 'SPY15M' + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds();
			const payload = {
				Symbol: candleToExecute.symbol,
				AccountKey: account.Key,
				AssetType: 'EQ',
				Duration: 'GTC',
				OrderType: 'StopLimit',
				StopPrice: stopPrice,
				LimitPrice: limitPrice,
				Quantity: quantity,
				TradeAction: stopLimitAction,
				OrderConfirmId: stopLimitAction + OrderConfirmId,
				OSOs:  [
					{
						Type: 'NORMAL',
						Orders: [
							{
								Symbol: candleToExecute.symbol,
								AccountKey: account.Key,
								AssetType: 'EQ',
								Duration: 'GTC',
								OrderType: 'StopMarket',
								StopPrice: stopLossPrice,
								Quantity: quantity,
								TradeAction: stopLossAction,
								OrderConfirmId: stopLossAction + OrderConfirmId,
							}
						]
					}
				],
			};
			
			http.postPurchaseOrder(payload, orderResponse);
		}
	};

    const orderResponse = (data) => {
        setOrderResponseData(data);
		setShowResponse(true);
    }

	return (
		<div>
			<Paper className={classes.orderContainer} >
				{patternCandles && patternCandles.length > 0 && patternCandles.map((candles) => (
					<Paper key={candles[1].title} className={classes.orderItem} onClick={() => handleClickOpen(candles)}>
						<CandleGrid 
							candles={candles}
						/>
					</Paper>
				))}
			</Paper>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">{candleInAction.title} {candleInAction.pattern !== "" ? candleInAction.pattern : ` - No Pattern - ${candleInAction.close > candleInAction.open ? 'Green Candle' : 'Red Candle'}`}</DialogTitle>
				<DialogContent className={classes.paper}>
					<Grid container spacing={1}>
						<Grid item >
							<ButtonBase className={classes.symbol} >
								<Typography variant="h4" component="h2">
									{candleInAction.symbol}
								</Typography>
							</ButtonBase>
						</Grid>
						<Grid item xs={12} sm container>
							<TextField
								disabled
								id="patternHigh"
								label={`High / ${candleInAction.close > candleInAction.open ? 'Buy Price' : 'Stop Loss'} + 0.01`}
								InputProps={{ readOnly: true, }}
								defaultValue={parseFloat(candleInAction.high)}
							/>
							<TextField
								disabled
								id="patternLow"
								label={`Low / ${candleInAction.close < candleInAction.open ? 'Sell Price' : 'Stop Loss'} - 0.01`}
								InputProps={{ readOnly: true, }}
								defaultValue={parseFloat(candleInAction.low)}
							/>
							<TextField
								disabled
								id="patternOpen"
								label="Open"
								InputProps={{ readOnly: true, }}
								defaultValue={parseFloat(candleInAction.open)}
							/>
							<TextField
								disabled
								id="patternClose"
								label="Close"
								InputProps={{ readOnly: true, }}
								defaultValue={parseFloat(candleInAction.close)}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSendOrderClick}  color="primary">
						Send Order
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
