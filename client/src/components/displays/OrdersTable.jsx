import { useContext, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { 
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
	Paper, Grid, Button, IconButton, Dialog, DialogActions, DialogTitle, 
	ButtonBase, Typography, TextField, DialogContent, DialogContentText,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Update';
import http from '../../utils/http';
import { OrderContext } from '../../contexts/OrderProvider';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		padding: 5
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

export default function OrdersTable() {
    const classes = useStyles();
    const { orders, reloadOrders } = useContext(OrderContext);
	const { setSymbolText } = useContext(ChartActionsContext);
	const [updateOpen, setUpdateOpen] = useState(false);
	const [orderInfo, setOrderInfo] = useState({});
	const [stopPrice, setStopPrice] = useState();
	const [limitPrice, setLimitPrice] = useState();
	const [orderType, setOrderType] = useState();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [limitError, setLimitError] = useState(false);
	const [limitErrorText, setLimitErrorText] = useState();
	const [stopError, setStopError] = useState(false);
	const [stopErrorText, setStopErrorText] = useState();
    
    const handleClickCancle = () => {
		setConfirmOpen(false);
        http.deletePurchaseOrder(orderInfo.OrderID, orderCancled);
    };

	const orderCancled = () => {
		reloadOrders();
	}
    
	const handleClickUpdate = (order) => {
		const type = order.Type.toUpperCase();
		setOrderType((type === 'BUY' || type === 'SELLSHORT') ? 'StopLimit' : 'StopMarket');
		setStopPrice(order.StopPrice);
		setLimitPrice(order.LimitPrice);
		setOrderInfo(order);
		setUpdateOpen(true);
    };

	const handleSendOrderClick = () => {
		setUpdateOpen(false);
		const payload = {
			order_id: orderInfo.OrderID,
			payload:{
				Symbol: orderInfo.Symbol,
				OrderType: orderType,
				StopPrice: stopPrice,
				LimitPrice: limitPrice,
				Quantity: orderInfo.Quantity,
			}
		};
		
		if((stopPrice !== orderInfo.StopPrice || limitPrice !== orderInfo.LimitPrice) && (!stopError || !limitError)) {
			http.updatePurchaseOrder(payload, orderUpdated);
		} 
	};

	const orderUpdated = () => {
		reloadOrders();
	}

	const handleClose = () => {
		setUpdateOpen(false);
	};

	const handleConfirmDialog = (order) => {
		setConfirmOpen(true);
		setOrderInfo(order)
	}

	const handleConfirmClose = () => {
		setConfirmOpen(false);
	};

	const handleTextChange = (e) => {
		const price = e.target.value;
		switch (e.target.name) {
			case 'STOPPRICE':
				if(price > limitPrice){
					setStopError(true);
					setStopErrorText(`Stop price cannot be greater than ${limitPrice}.`);
				} else {
					setStopError(false);
					setStopErrorText('');
					setStopPrice(price);
				}
				break;

			case 'LIMITPRICE':
				if(price < stopPrice){
					setLimitError(true);
					setLimitErrorText(`Limit price cannot be less than ${stopPrice}.`);
				} else {
					setLimitError(false);
					setLimitErrorText('');
					setLimitPrice(price);
				}
				break;

			default:
				break;
		}
	}

    return (
		<Grid container>
			<Grid item xs={12}  > 
				<TableContainer component={Paper} className={classes.container}>
					<Table className={classes.table} stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Symbol</StyledTableCell>
								<StyledTableCell>Order#</StyledTableCell>
								<StyledTableCell>OrderStatus</StyledTableCell>
								<StyledTableCell>Type</StyledTableCell>
								<StyledTableCell>Entered</StyledTableCell>
								<StyledTableCell>Quantity</StyledTableCell>
								<StyledTableCell>StopPrice</StyledTableCell>
								<StyledTableCell>LimitPrice</StyledTableCell>
								<StyledTableCell>FilledPrice</StyledTableCell>
								<StyledTableCell>Duration</StyledTableCell>
								<StyledTableCell>RejectReason</StyledTableCell>
								<StyledTableCell><UpdateIcon /></StyledTableCell>
								<StyledTableCell><DeleteForeverIcon /></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders && orders.map((order) => (
								<StyledTableRow 
									key={order.OrderID}
									className={classes.row}
								>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Symbol}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.OrderID}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.StatusDescription}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Type}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.TimeStamp}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Quantity}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.StopPriceText}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.LimitPriceText}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.FilledPriceText}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.Duration}</StyledTableCell>
									<StyledTableCell onClick={() => setSymbolText(order.Symbol)}>{order.RejectReason}</StyledTableCell>
									<StyledTableCell>
										<IconButton
											className={classes.iconButton}
											edge='end'
											color='primary'
											disabled={order.StatusDescription !== 'Queued' && order.StatusDescription !== 'Received'}
											onClick={() => handleClickUpdate(order)}
										>
											<UpdateIcon />
										</IconButton>
									</StyledTableCell>
									<StyledTableCell>
										<IconButton
											className={classes.iconButton}
											edge='end'
											color='secondary'
											disabled={order.StatusDescription !== 'Queued' && order.StatusDescription !== 'Received'}
											onClick={() => handleConfirmDialog(order)}
										>
											<DeleteForeverIcon />
										</IconButton>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Dialog open={updateOpen} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm'>
					<DialogTitle id="form-dialog-title" className={classes.header} >
						Update Order
					</DialogTitle>
					<Paper className={classes.paper}>
						<Grid container spacing={2}>
							<Grid item container xs={3} className={classes.symbolContainer}>
								<Grid item  >
									<ButtonBase className={classes.symbol} >
										<Typography variant="h4" component="h2">
											{orderInfo.Symbol}
										</Typography>
									</ButtonBase>
								</Grid>
							</Grid>
							<Grid item xs={9} sm container spacing={2}>
								<Grid item xs={6}>
									<TextField
										id="QUANTITY"
										name="QUANTITY"
										label="QUANTITY"
										InputProps={{ readOnly: true, }}
										defaultValue={orderInfo.Quantity}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="ORDERID"
										label="ORDER ID"
										InputProps={{ readOnly: true, }}
										defaultValue={orderInfo.OrderID}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id={orderType}
										label={orderType}
										InputProps={{ readOnly: true, }}
										defaultValue={orderType}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										error={limitError}
										id={`LIMITPRICE`}
										name="LIMITPRICE"
										label={`LIMIT PRICE`}
										defaultValue={orderInfo.LimitPrice}
										onChange={handleTextChange}
										helperText={limitErrorText}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										error={stopError}
										id="STOPPRICE"
										name="STOPPRICE"
										label="STOP PRICE"
										defaultValue={orderInfo.StopPrice}
										onChange={handleTextChange}
										helperText={stopErrorText}
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
				<Dialog
					open={confirmOpen}
					onClose={handleConfirmClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Deleting {orderInfo.Symbol} {orderInfo.Type} Order</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Are you sure you want to delete this orderid {orderInfo.OrderID}?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleConfirmClose} color="primary">
							Disagree
						</Button>
						<Button onClick={handleClickCancle} color="primary" autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		</Grid>
    );
}

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 700,
	},
	row: {
		cursor: 'pointer',
		top: 0,
		bottom: 0,
	},
	container: {
		height: 270,
		top: 0,
		bottom: 0,
		position: 'relative',
	},
	iconButton: {
		padding: 0,
	},
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
    },
    header: {
		color: theme.palette.common.white,
		backgroundColor: theme.palette.common.black,
		textAlign: 'center',
		height: 50,
	},
	buttonStyle: {
		color: theme.palette.common.white,
        backgroundColor: "#3f51b5",
		width: '100%',
		height: '50px',
    },
	dialogAction: {
		width: '100%',
	},
    symbol: {
        width: 100,
        height: 80,
    },
	symbolContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
}))