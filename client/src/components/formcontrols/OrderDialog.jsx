import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Button, ButtonBase, Dialog, DialogActions, DialogTitle, Grid, Paper, TextField, Typography 
} from '@material-ui/core';
import CandleGrid from '../cards/CandleGrid';
import { OrderContext } from '../../contexts/OrderProvider';
import TerminalDialog from '../formcontrols/TerminalDialog';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { green, red } from '@material-ui/core/colors';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import greenCandle from '../../res/green.png';
import redCandle from '../../res/red.png';

export default function OrderDialog({patternCandles}) {
	const classes = useStyles();
	const { 
		orderResponseData, showResponse, setShowResponse, 
		open, orderSymbol, isBullish, stopLimitAction, stopLossAction, stopPrice, limitPrice,stopLossPrice, riskOffset, 
		trailingStopPrice, quantity, orderConfirmId, stopPriceOffset, limitPriceOffset, stopLossPriceOffset, title, pattern,
		highPrice, lowPrice, openPrice, closePrice, handleSendOrderClick, handleTextChange, handleClose,
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

	return (
		<div>
			<Paper className={classes.orderContainer} >
				{patternCandles && patternCandles.length > 0 && patternCandles.map((candles) => (
					<Paper key={candles[1].title + candles[1].symbol} className={classes.orderItem} >
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
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='md'>
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
							<Grid item xs={4}>
								<TextField
									id="QUANTITY"
									name="QUANTITY"
									label="QUANTITY"
									defaultValue={quantity}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='RISKOFFSET'
									name='RISKOFFSET'
									label='RISK OFFSET (R)'
									defaultValue={riskOffset}
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
									defaultValue={stopPriceOffset}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='LIMITOFFSET'
									name='LIMITOFFSET'
									label='LIMIT OFFSET'
									defaultValue={limitPriceOffset}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id='LOSSOFFSET'
									name='LOSSOFFSET'
									label='LOSS OFFSET'
									defaultValue={stopLossPriceOffset}
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
									name="STOPPRICE"
									label={stopLimitAction}
									defaultValue={stopPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id={`LIMITPRICE`}
									name="LIMITPRICE"
									label={`LIMITPRICE`}
									defaultValue={limitPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id={stopLossAction}
									name="STOPLOSSPRICE"
									label={stopLossAction}
									defaultValue={stopLossPrice}
									onChange={handleTextChange}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									id="TRAILINGSTOP"
									name="TRAILINGSTOP"
									label="TrailingStop / 1R"
									defaultValue={trailingStopPrice}
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
}));

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