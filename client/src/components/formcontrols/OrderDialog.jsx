import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button, ButtonBase, Dialog, DialogActions, DialogTitle, Grid, Paper, TextField, Typography,
	RadioGroup, Radio, FormControlLabel, FormLabel, FormControl, Divider
} from '@material-ui/core';
import CandleGrid from '../cards/CandleGrid';
import { OrderContext } from '../../contexts/OrderProvider';
import TerminalDialog from '../formcontrols/TerminalDialog';
import { green, red } from '@material-ui/core/colors';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import greenCandle from '../../res/green.png';
import redCandle from '../../res/red.png';

export default function OrderDialog({patternCandles}) {
	const classes = useStyles();
	const { 
		orderResponseData, showResponse, setShowResponse, 
		orderOpen, orderSymbol, isBullish, stopLimitAction, stopLossAction, stopPrice, limitPrice,stopLossPrice, riskOffset, 
		trailingStopPrice, quantity, orderConfirmId, title, pattern, highPrice, lowPrice, openPrice, closePrice, oneRPrice,
		handleSendOrderClick, handleTextChange, handleClose, orderTypeValue, handleRadioChange, target1Price, target2Price, 
	} = useContext(OrderContext);

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

	const trailingStopOrder = (
		<>
			<Grid item xs={12}>
				<TextField
					id="TRAILINGSTOP"
					name="TRAILINGSTOP"
					label="TRAILINGSTOP / 1R"
					value={trailingStopPrice}
					onChange={handleTextChange}
				/>
			</Grid>
		</>
	)

	const bracket1Target1TSOrder = (
		<>
			<Grid item xs={6}>
				<TextField
					id="TRAILINGSTOP"
					name="TRAILINGSTOP"
					label="TRAILINGSTOP / 1R"
					value={trailingStopPrice}
					onChange={handleTextChange}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					id="TARGET1"
					name="TARGET1"
					label="TARGET 1 PRICE 1/2R"
					value={target1Price}
					onChange={handleTextChange}
				/>
			</Grid>
		</>
	)

	const bracket2Target2TSOrder = (
		<>
			<Grid item xs={4}>
				<TextField
					id="TRAILINGSTOP"
					name="TRAILINGSTOP"
					label="TRAILINGSTOP / 1R EACH"
					value={trailingStopPrice}
					onChange={handleTextChange}
				/>
			</Grid>
			<Grid item xs={4}>
				<TextField
					id="TARGET1"
					name="TARGET1"
					label="TARGET 1 PRICE 1/2R"
					value={target1Price}
					onChange={handleTextChange}
				/>
			</Grid>
			<Grid item xs={4}>
				<TextField
					id="TARGET2"
					name="TARGET2"
					label="TARGET 2 PRICE 1R"
					value={target2Price}
					onChange={handleTextChange}
				/>
			</Grid>
		</>
	)

	const bracket1Target1LossOrder = (
		<>
			<Grid item xs={12}>
				<TextField
					id="TARGET1"
					name="TARGET1"
					label="TARGET 1 PRICE 1/2R"
					value={target1Price}
					onChange={handleTextChange}
				/>
			</Grid>
		</>
	)

	const bracket2Target2LossOrder = (
		<>
			<Grid item xs={6}>
				<TextField
					id="TARGET1"
					name="TARGET1"
					label="TARGET 1 PRICE 1/2R"
					value={target1Price}
					onChange={handleTextChange}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					id="TARGET2"
					name="TARGET2"
					label="TARGET 2 PRICE 1R"
					value={target2Price}
					onChange={handleTextChange}
				/>
			</Grid>
		</>
	)

	return (
		<div>
			<Paper className={classes.orderContainer} >
				{patternCandles && patternCandles.length > 0 && patternCandles.map((candles) => (
					<Paper key={candles[1].title + candles[1].symbol + candles[1].timeframe} className={classes.orderItem} >
						<CandleGrid 
							candles={candles}
						/>
					</Paper>
				))}				
			</Paper>
			{showResponse ?
				<TerminalDialog  
					jsonData={orderResponseData}
					showResponse={showResponse}
					setShowResponse={setShowResponse}
				/>
				: ''
			}
			<Dialog open={orderOpen} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='md'>
				<DialogTitle id="form-dialog-title" className={classes.header} >
					{title} {pattern !== "" ? pattern + ' ' : ` - No Pattern `} 
					<ButtonBase>
						{isBullish 
							? <TrendingUpIcon style={{ color: green[500] }} />
							: <TrendingDownIcon style={{ color: red[500] }} />
						}
					</ButtonBase>
					{` Last Price:`} {closePrice}
				</DialogTitle>
				<Paper className={classes.paper}>
					<Grid container spacing={2}>
						<FormControl component="fieldset" className={classes.formControl}>
							<FormLabel component="legend">Order Type Selection (TS = Trailing Stop)</FormLabel>
							<RadioGroup className={classes.radioControl} name="orderType" defaultValue='bracket1Target1TS' value={orderTypeValue} onChange={handleRadioChange}>
								<FormControlLabel value="trailingStop" control={<Radio />} label="Trailing Stop" />
								<FormControlLabel value="bracket1Target1TS" control={<Radio />} label="1 Target / 1 TS" />
								<FormControlLabel value="bracket2Target2TS" control={<Radio />} label="2 Target / 2 TS" />
								<FormControlLabel value="bracket1Target1Loss" control={<Radio />} label="1 Target / 1 Loss" />
								<FormControlLabel value="bracket2Target2Loss" control={<Radio />} label="2 Target / 2 Loss" />
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid container spacing={2}>
						<Grid item container xs={3} >
							<Grid item >
								<ButtonBase className={classes.orderSymbol} >
									<Typography variant="h4" component="h2">
										{orderSymbol}
									</Typography>
								</ButtonBase>
							</Grid>
						</Grid>
						<Grid item xs={9} sm container spacing={2}>
							<Grid item container xs={3}>
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
							
							<Grid item container xs={8}>
								<Grid item xs={6}>
									<TextField
										id="QUANTITY"
										name="QUANTITY"
										label="QUANTITY"
										defaultValue={quantity}
										onChange={handleTextChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="CONFIRMID"
										label="CONFIRM ID"
										InputProps={{ readOnly: true, }}
										defaultValue={orderConfirmId}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id='RISKOFFSET'
										name='RISKOFFSET'
										label='RISK/REWARD OFFSET'
										defaultValue={riskOffset}
										onChange={handleTextChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id='ONERPRICE'
										name='ONERPRICE'
										label='ONE "R" PRICe'
										defaultValue={oneRPrice}
										InputProps={{ readOnly: true, }}
									/>
								</Grid>
							</Grid>
							
						</Grid>
					</Grid>
					<Divider className={classes.divider} />
					<Grid container spacing={2} >
						<Grid item container xs={3}></Grid>	
						<Grid item xs={9} sm container spacing={2}>
							<Grid item xs={4}>
								<TextField
									id={stopLimitAction}
									name="STOPPRICE"
									label={stopLimitAction}
									value={stopPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id={`LIMITPRICE`}
									name="LIMITPRICE"
									label={`LIMITPRICE`}
									value={limitPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id={stopLossAction}
									name="STOPLOSSPRICE"
									label="STOP LOSS / 1R"
									value={stopLossPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							{
								orderTypeValue === 'bracket1Target1TS' ?
									bracket1Target1TSOrder
								:
								orderTypeValue === 'bracket2Target2TS' ?
									bracket2Target2TSOrder
								:
								orderTypeValue === 'bracket1Target1Loss' ?
									bracket1Target1LossOrder
								:
								orderTypeValue === 'bracket2Target2Loss' ?
									bracket2Target2LossOrder
								:
									trailingStopOrder
							}
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
    orderSymbol: {
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
	formControl: {
	  margin: theme.spacing(1),
	  width: '100%',
	},
	radioControl: {
	  margin: theme.spacing(1),
	  width: '100%',
	  display: 'flex',
	  justifyContent: 'space-between',
	  flexDirection: 'row',
	},
	divider: {
	  margin: theme.spacing(2),
	},
}));
