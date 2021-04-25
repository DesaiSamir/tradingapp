import { useContext, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { 
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
	Paper, Grid, Button, IconButton, Dialog, DialogActions, DialogTitle, 
	ButtonBase, Typography, TextField,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import UpdateIcon from '@material-ui/icons/Update';
import { UserContext } from '../../contexts/UserProvider';
import http from '../../utils/http';
import NumberFormat from 'react-number-format';

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
		backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

export default function OrdersTable() {
    const classes = useStyles();
    const { orders, reloadOrders } = useContext(UserContext);
	const [open, setOpen] = useState(false);
	const [orderInfo, setOrderInfo] = useState({});
	const [stopPrice, setStopPrice] = useState();
	const [limitPrice, setLimitPrice] = useState();
    
    const handleClickCancle = (orderId) => {
        http.deletePurchaseOrder(orderId, orderCancled);
    };

	const orderCancled = () => {
		reloadOrders();
	}
    
	const handleClickUpdate = (order) => {
		const dbOrder = orders.dbOrders.filter(o => o.provider_order_id === order.OrderID.toString());
		setOrderInfo(dbOrder[0]);
		setOpen(true);
    };

	const handleSendOrderClick = () => {
		setOpen(false);
		const payload = {
			order_id: orderInfo.provider_order_id,
			payload:{
				Symbol: orderInfo.symbol,
				OrderType: orderInfo.order_type,
				StopPrice: stopPrice,
				LimitPrice: limitPrice,
				Quantity: orderInfo.quantity,
			}
		};
		http.updatePurchaseOrder(payload, orderUpdated);
	};

	const orderUpdated = () => {
		reloadOrders();
	}

	const handleClose = () => {
		setOpen(false);
	};

	const handleTextChange = (e) => {
		switch (e.target.name) {
			case 'STOPPRICE':
				setStopPrice(e.target.value);
				break;

			case 'LIMITPRICE':
				setLimitPrice(e.target.value);
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
							{orders && orders.retOrders.map((order) => (
								<StyledTableRow key={order.OrderID}>
									<StyledTableCell>{order.Symbol}</StyledTableCell>
									<StyledTableCell>{order.OrderID}</StyledTableCell>
									<StyledTableCell>{order.StatusDescription}</StyledTableCell>
									<StyledTableCell>{order.Type}</StyledTableCell>
									<StyledTableCell>{order.TimeStamp}</StyledTableCell>
									<StyledTableCell>{order.Quantity}</StyledTableCell>
									<StyledTableCell>{order.StopPriceText}</StyledTableCell>
									<StyledTableCell>{order.LimitPriceText}</StyledTableCell>
									<StyledTableCell>{order.FilledPriceText}</StyledTableCell>
									<StyledTableCell>{order.Duration}</StyledTableCell>
									<StyledTableCell>{order.RejectReason}</StyledTableCell>
									<StyledTableCell>
										<IconButton
											className={classes.iconButton}
											edge='end'
											color='primary'
											disabled={order.StatusDescription !== 'Queued'}
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
											disabled={order.StatusDescription !== 'Queued'}
											onClick={() => handleClickCancle(order.OrderID)}
										>
											<DeleteForeverIcon />
										</IconButton>
									</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm'>
					<DialogTitle id="form-dialog-title" className={classes.header} >
						Update Order
					</DialogTitle>
					<Paper className={classes.paper}>
						<Grid container spacing={2}>
							<Grid item container xs={3} className={classes.symbolContainer}>
								<Grid item  >
									<ButtonBase className={classes.symbol} >
										<Typography variant="h4" component="h2">
											{orderInfo.symbol}
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
										defaultValue={orderInfo.quantity}
										// value={quantity}
										// onChange={handleTextChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="CONFIRMID"
										label="CONFIRM ID"
										InputProps={{ readOnly: true, }}
										defaultValue={orderInfo.order_confirm_id}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id={orderInfo.order_type}
										label={orderInfo.order_type}
										InputProps={{ readOnly: true, }}
										defaultValue={orderInfo.order_type}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id={`LIMITPRICE`}
										name="LIMITPRICE"
										label={`LIMIT PRICE`}
										// InputProps={{ inputComponent: NumberFormatCustom, }}
										defaultValue={orderInfo.limit_price}
										// value={orderInfo.limit_price}
										onChange={handleTextChange}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										id="STOPPRICE"
										name="STOPPRICE"
										label="STOP PRICE"
										// InputProps={{ inputComponent: NumberFormatCustom, }}
										defaultValue={orderInfo.stop_price}
										// value={orderInfo.stop_price}
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
			</Grid>
			<Grid item xs={12} >
				<TableContainer component={Paper} className={classes.container}>
					<Table className={classes.table} stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Symbol</StyledTableCell>
								<StyledTableCell>Order#</StyledTableCell>
								<StyledTableCell>OrderStatus</StyledTableCell>
								<StyledTableCell>Type</StyledTableCell>
								<StyledTableCell>TradeAction</StyledTableCell>
								<StyledTableCell>Entered</StyledTableCell>
								<StyledTableCell>Quantity</StyledTableCell>
								<StyledTableCell>StopPrice</StyledTableCell>
								<StyledTableCell>LimitPrice</StyledTableCell>
								<StyledTableCell>Duration</StyledTableCell>
								<StyledTableCell>OrderConfirmId</StyledTableCell>
								<StyledTableCell>Message</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders && orders.dbOrders.map((order) => (
								<StyledTableRow key={order.provider_order_id}>
									<StyledTableCell>{order.symbol}</StyledTableCell>
									<StyledTableCell>{order.provider_order_id}</StyledTableCell>
									<StyledTableCell>{order.order_status}</StyledTableCell>
									<StyledTableCell>{order.order_type}</StyledTableCell>
									<StyledTableCell>{order.trade_action}</StyledTableCell>
									<StyledTableCell>{order.created}</StyledTableCell>
									<StyledTableCell>{order.quantity}</StyledTableCell>
									<StyledTableCell>{order.stop_price}</StyledTableCell>
									<StyledTableCell>{order.limit_price}</StyledTableCell>
									<StyledTableCell>{order.duration}</StyledTableCell>
									<StyledTableCell>{order.order_confirm_id}</StyledTableCell>
									<StyledTableCell>{order.message}</StyledTableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
    );
}

const useStyles = makeStyles((theme) => ({
	table: {
		minWidth: 700,
	},
	container: {
		height: (window.innerHeight - 112) / 2,
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