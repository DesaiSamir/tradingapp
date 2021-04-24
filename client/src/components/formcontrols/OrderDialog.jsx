import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import {
	Paper, Dialog, DialogActions, DialogTitle, Grid, 
	ButtonBase, Typography, 
} from '@material-ui/core';
import CandleGrid from '../cards/CandleGrid';
import http from '../../utils/http';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { green, red } from '@material-ui/core/colors';
import greenCandle from '../../res/green.png';
import redCandle from '../../res/red.png';
import UserProvider from '../../contexts/UserProvider';

function NumberFormatCustom(props) {
    const { inputRef, onChange, prefix, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        prefix={prefix}
      />
    );
}
  
NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	prefix: PropTypes.string,
};

export default function OrderDialog({patternCandles, setOrderResponseData, setShowResponse}) {
	const classes = useStyles();
	const { equitiesAccountKey } = useContext(UserProvider.context);
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
	const [symbol, setSymbol] = useState();
	const [isBullish, setIsBullish] = useState();
	const [stopLimitAction, setStopLimitAction] = useState();
	const [stopLossAction, setStopLossAction] = useState();
	const [stopPrice, setStopPrice] = useState();
	const [limitPrice, setLimitPrice] = useState();
	const [stopLossPrice, setStopLossPrice] = useState();
	const [riskOffset, setRiskOffset] = useState();
	const [trailingStopPrice, setTrailingStopPrice] = useState();
	const [quantity, setQuantity] = useState();
	const [orderConfirmId, setOrderConfirmId] = useState();
	const [stopPriceOffset, setStopPriceOffset] = useState();
	const [limitPriceOffset, setLimitPriceOffset] = useState();
	const [stopLossPriceOffset, setStopLossPriceOffset] = useState();
	const [title, setTitle] = useState();
	const [pattern, setPattern] = useState();
	const [highPrice, setHighPrice] = useState();
	const [lowPrice, setLowPrice] = useState();
	const [openPrice, setOpenPrice] = useState();
	const [closePrice, setClosePrice] = useState();

	var lastClosePrice = 0;
	if(patternCandles.length > 0){
		lastClosePrice = patternCandles.find(candles => candles.find(candle => candle.title === 'Current Candle'))
										.find(candle => candle.title === 'Current Candle').close;
	}
	useEffect(() => {
		const c = candleInAction;
		const isBullish = c.close > c.open;
		const stopLimitAction = isBullish ? 'BUY' : 'SELLSHORT';
		const stopLossAction = isBullish ? 'SELL' : 'BUYTOCOVER';
		const spo = 0.01;
		const lpo = 0.03;
		const slpo = 0.01;
		const stopPrice = isBullish ? c.high + spo : c.low - spo;
		const limitPrice = isBullish ? c.high + lpo : c.low - lpo;
		var stopLossPrice = isBullish ? c.low - slpo : c.high + slpo;
		const trailingStopPrice = isBullish ? stopPrice - stopLossPrice : stopLossPrice - stopPrice;
		// stopLossPrice = isBullish ? stopPrice - (trailingStopPrice/2) : stopPrice + (trailingStopPrice/2);

		var currentTime = new Date();
		const orderConfirmId = `${stopLimitAction + c.symbol + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds()}`;
		
		setHighPrice(parseFloat(c.high).toFixed(2));
		setLowPrice(parseFloat(c.low).toFixed(2));
		setOpenPrice(parseFloat(c.open).toFixed(2));
		setClosePrice(parseFloat(c.close).toFixed(2));
		setTitle(c.title);
		setPattern(c.pattern);
		setSymbol(c.symbol);
		setIsBullish(isBullish);
		setStopPriceOffset(spo);
		setLimitPriceOffset(lpo);
		setStopLossPriceOffset(slpo);
		setStopLimitAction(stopLimitAction);
		setStopLossAction(stopLossAction);
		setStopPrice(parseFloat(stopPrice).toFixed(2));
		setLimitPrice(parseFloat(limitPrice).toFixed(2));
		setStopLossPrice(parseFloat(stopLossPrice).toFixed(2));
		setTrailingStopPrice(parseFloat(trailingStopPrice).toFixed(2));
		setRiskOffset(parseFloat(1).toFixed(2));
		setQuantity(100);
		setOrderConfirmId(orderConfirmId);

	}, [candleInAction]);

	const handleClickOpen = (candles) => {
		setOpen(true);
		setCandleInAction(candles[1]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSendOrderClick = () => {
		setOpen(false);
		
		const payload = {
			Symbol: symbol,
			AccountKey: equitiesAccountKey,
			AssetType: 'EQ',
			Duration: 'GTC',
			OrderType: 'StopLimit',
			StopPrice: stopPrice,
			LimitPrice: limitPrice,
			Quantity: quantity,
			TradeAction: stopLimitAction,
			OrderConfirmId: orderConfirmId,
			OSOs:  [
				{
					Type: 'NORMAL',
					Orders: [
						{
							Symbol: symbol,
							AccountKey: equitiesAccountKey,
							AssetType: 'EQ',
							Duration: 'GTC',
							OrderType: 'StopMarket',
							StopPrice: riskOffset,
							Quantity: quantity,
							TradeAction: stopLossAction,
							OrderConfirmId: orderConfirmId + 'TS',
							AdvancedOptions: {
								TrailingStop: {
									Amount: trailingStopPrice,
								}
							},
							Legs: [
								{
									Symbol: symbol,
									Quantity: quantity,
									TradeAction: stopLossAction,
								}
							]
						}
					]
				}
			],
		};
		// setOrderResponseData(payload);
		// setShowResponse(true);
		http.postPurchaseOrder(payload, orderResponse);
	};

    const orderResponse = (data) => {
        setOrderResponseData(data);
		setShowResponse(true);
    }
	const lastClosePriceDiv = (
		<>
			<Grid item xs={6}>
				Close:
			</Grid>
			<Grid item xs={6}>
				{closePrice}
			</Grid>
		</>
	); 
	const lastOpenPriceDiv = (
		<>
			<Grid item xs={6}>
				Open:
			</Grid>
			<Grid item xs={6}>
				{openPrice}
			</Grid>
		</>
	); 
	const handleTextChange = (e) => {
		switch (e.target.name) {
			case 'RISKOFFSET':
				setRiskOffset(e.target.value);
				break;

			case 'QUANTITY':
				setQuantity(e.target.value);
				break;
			
			case 'STOPOFFSET':
				setStopPriceOffset(e.target.value);
				break;

			case 'LIMITOFFSET':
				setLimitPriceOffset(e.target.value);
				break;
			
			case 'LOSSOFFSET':
				setStopLossPrice(e.target.value);
				break;

			case 'TRAILINGSTOP':
				setTrailingStopPrice(e.target.value);
				break;

			default:
				break;
		}
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
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='md'>
				<DialogTitle id="form-dialog-title" className={classes.header} >
					{title} {pattern !== "" ? pattern + ' ' : ` - No Pattern `} 
					<ButtonBase>
						{isBullish 
							? <TrendingUpIcon style={{ color: green[500] }} />
							: <TrendingDownIcon style={{ color: red[500] }} />
						}
					</ButtonBase>
					{` Last Price:`} {lastClosePrice}
				</DialogTitle>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<Grid item container xs={3} >
							<Grid item >
								<ButtonBase className={classes.symbol} >
									<Typography variant="h4" component="h2">
										{symbol}
									</Typography>
								</ButtonBase>
							</Grid>
						</Grid>
						<Grid item xs={9} sm container spacing={2}>
							<Grid item xs={4}>
								<TextField
									id="QUANTITY"
									name="QUANTITY"
									label="QUANTITY"
									InputProps={{ inputComponent: NumberFormatCustom, }}
									defaultValue={quantity}
									value={quantity}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='RISKOFFSET'
									name='RISKOFFSET'
									label='RISK OFFSET (R)'
									InputProps={{ inputComponent: NumberFormatCustom,}}
									defaultValue={riskOffset}
									value={riskOffset}
									onChange={handleTextChange}
									prefix='%'
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="CONFIRMID"
									label="CONFIRM ID"
									InputProps={{ readOnly: true, }}
									defaultValue={orderConfirmId}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="STOPOFFSET"
									name="STOPOFFSET"
									label="STOP OFFSET"
									InputProps={{ inputComponent: NumberFormatCustom, }}
									defaultValue={stopPriceOffset}
									value={stopPriceOffset}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='LIMITOFFSET'
									name='LIMITOFFSET'
									label='LIMIT OFFSET'
									InputProps={{ inputComponent: NumberFormatCustom, }}
									defaultValue={limitPriceOffset}
									value={limitPriceOffset}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='LOSSOFFSET'
									name='LOSSOFFSET'
									label='LOSS OFFSET'
									InputProps={{ inputComponent: NumberFormatCustom, }}
									defaultValue={stopLossPriceOffset}
									value={stopLossPriceOffset}
									onChange={handleTextChange}
								/>
							</Grid>
							
						</Grid>
					</Grid>
					<Grid container spacing={2} >
						<Grid item container xs={2}>
							<Grid item xs={6}>
								High:
							</Grid>
							<Grid item xs={6}>
								{highPrice}
							</Grid>

							{isBullish ? lastClosePriceDiv : lastOpenPriceDiv}
							{isBullish ? lastOpenPriceDiv : lastClosePriceDiv}
							
							<Grid item xs={6}>
								Low:
							</Grid>
							<Grid item xs={6}>
								{lowPrice}
							</Grid>
						</Grid>					
						<Grid item container xs={1}>
							<img src={isBullish ? greenCandle : redCandle} className={classes.image} alt="" />
						</Grid>
						<Grid item xs={9} sm container spacing={2}>
							<Grid item xs={6}>
								<TextField
									id={stopLimitAction}
									label={stopLimitAction}
									InputProps={{ readOnly: true, }}
									defaultValue={stopPrice}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id={`STOPLIMIT`}
									label={`STOPLIMIT`}
									InputProps={{ readOnly: true, }}
									defaultValue={limitPrice}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id={stopLossAction}
									label={stopLossAction}
									InputProps={{ readOnly: true, }}
									defaultValue={stopLossPrice}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id="TRAILINGSTOP"
									name="TRAILINGSTOP"
									label="TrailingStop / 1R"
									InputProps={{ inputComponent: NumberFormatCustom, }}
									defaultValue={trailingStopPrice}
									value={trailingStopPrice}
									onChange={handleTextChange}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				<DialogActions className={classes.buttonStyle}>
					<Button onClick={handleSendOrderClick} className={classes.buttonStyle} >
						Send Order
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

const useStyles = makeStyles((theme) => ({
    header: {
		color: theme.palette.common.white,
		backgroundColor: theme.palette.common.black,
		textAlign: 'center',
	},
	buttonStyle: {
		color: theme.palette.common.white,
        backgroundColor: "#3f51b5",
		width: '100%',
		height: '50px',
		// margin: 0,
    },
	dialogAction: {
		// margin: 0,
		width: '100%',
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
	image: {
		maxHeight: 100,
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

