import { useContext, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';
import { OrderContext } from '../../contexts/OrderProvider';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import http from '../../utils/http';
import { UserContext } from '../../contexts/UserProvider';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
	padding: 5,
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.white,
	padding: 5,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
		
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 700,
	},
	rows: {
		overflowY: 'auto',
		height: (300),
	},
	row: {
		cursor: 'pointer',
	},
	container: {
		maxHeight: 270,
	},
	up: {
		backgroundColor: theme.palette.success.light,
	},
	up50: {
		backgroundColor: theme.palette.success.main,
	},
	up200: {
		backgroundColor: theme.palette.success.dark,
	},
	down: {
		backgroundColor: theme.palette.error.light,
	},
	down50: {
		backgroundColor: theme.palette.error.main,
	},
	down200: {
		backgroundColor: theme.palette.error.dark,
	},
	is0: {
		backgroundColor: theme.palette.warning.light,
	},
}));

export default function PositionsTable() {
    const classes = useStyles();
    const { equitiesAccountKey } = useContext(UserContext);
    const { positions, reloadOrders, activeOrders } = useContext(OrderContext);
	const { setSymbolText } = useContext(ChartActionsContext);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [orderInfo, setOrderInfo] = useState({});

    const handleClosePosition = () => {
		setConfirmOpen(false);

		const quantity = orderInfo.Quantity;
		const pos = orderInfo.LongShort;
		const stopLossAction = pos === 'Long' ? 'SELL' : 'BUYTOCOVER';

		const payload = {
			payload:{
				Symbol: orderInfo.Symbol,
				AccountKey: equitiesAccountKey,
				AssetType: 'EQ',
				Duration: 'GTC',
				OrderType: 'Market',
				Quantity: quantity < 0 ? quantity * -1 : quantity,
				TradeAction: stopLossAction,
			}
		};
		const orders = activeOrders.filter(o => o.Symbol === orderInfo.Symbol);
		orders.forEach(order => {
			http.deletePurchaseOrder(order.OrderID, positionClosed);
		});
		console.log({payload, orders});
		setTimeout(() => {
			http.closePosition(payload, positionClosed);			
		}, 2000);

    };

	const positionClosed = (data) => {
		console.log(data);
		reloadOrders();
	}

	const handleConfirmDialog = (order) => {
		setConfirmOpen(true);
		setOrderInfo(order)
	}

	const handleConfirmClose = () => {
		setConfirmOpen(false);
	};
	
    return (
		<>
			<TableContainer component={Paper} className={classes.container}>
				<Table className={classes.table} stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Symbol</StyledTableCell>
							<StyledTableCell>Description</StyledTableCell>
							<StyledTableCell>Position</StyledTableCell>
							<StyledTableCell>Open P/L</StyledTableCell>
							<StyledTableCell>Avg Price</StyledTableCell>
							<StyledTableCell>Last</StyledTableCell>
							<StyledTableCell>Today's Open P/L</StyledTableCell>
							<StyledTableCell>Open P/L / Qty</StyledTableCell>
							<StyledTableCell>Open P/L %</StyledTableCell>
							<StyledTableCell>Total Cost</StyledTableCell>
							<StyledTableCell>Market Value</StyledTableCell>
							<StyledTableCell><DeleteForeverIcon /></StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{positions && positions.map((order) => (
							<StyledTableRow 
								key={order.TimeStamp} 
								className={
									`${order.OpenProfitLoss === 0 
									? classes.is0 
									: order.OpenProfitLoss > 0
										? order.OpenProfitLoss > 200 ? classes.up200 : order.OpenProfitLoss > 50 ? classes.up50 : classes.up 
										: order.OpenProfitLoss < -200 ? classes.down200 : order.OpenProfitLoss < -50 ? classes.down50 : classes.down}
									${classes.row}`} 
							>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Symbol}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Description}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Quantity}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.OpenProfitLoss).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.AveragePriceDisplay).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.LastPriceDisplay).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.TodaysProfitLoss).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.OpenProfitLossQty).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.OpenProfitLossPercent).toFixed(2)} %</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.TotalCost).toFixed(2)}</StyledTableCell>
								<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{parseFloat(order.MarketValue).toFixed(2)}</StyledTableCell>
								<StyledTableCell>
									<DeleteForeverIcon onClick={() => handleConfirmDialog(order)}/>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog
				open={confirmOpen}
				onClose={handleConfirmClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Closing {orderInfo.Symbol} {orderInfo.Type} Position</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to close this position with {orderInfo.OpenProfitLoss} P/L at market price?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleConfirmClose} color="primary">
						Disagree
					</Button>
					<Button onClick={handleClosePosition} color="primary" autoFocus>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</>
    );
}