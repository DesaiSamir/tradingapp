import { useState, forwardRef, useContext, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import {
    AddBox, ArrowDownward, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, 
    Edit, FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn, Cached
} from '@material-ui/icons';
import { OrderContext } from "../../contexts/OrderProvider";
import { 
    Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, 
    DialogTitle, Grid, Paper, TextField, Typography 
} from "@material-ui/core";
import http from '../../utils/http';

const OrdersTable = ({containerHeight, orders}) => {
    const classes = useStyles();
    const { reloadOrders } = useContext(OrderContext);
    const [columns, setColumns] = useState([]);    
    const [data, setData] = useState(orders);
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
	const [isTrailingStop, setIsTrailingStop] = useState(false);
	const [trailingStop, setTrailingStop] = useState();

    useEffect(() => {
        setData(orders);
        setColumns([
            { title: 'Symbol', field: 'Symbol' },
            { title: 'OrderID', field: 'OrderID' },
            { title: 'OrderStatus', field: 'OrderStatus' },
            { title: 'Type', field: 'Type' },
            { title: 'Entered', field: 'TimeStamp', dateSetting: {locale: 'en-US'} },
            { title: 'Quantity', field: 'Quantity' },
            { title: 'StopPrice', field: 'StopPrice' },
            { title: 'LimitPrice', field: 'LimitPrice' },
            { title: 'FilledPrice', field: 'FilledPriceText' },
            { title: 'Duration', field: 'Duration' },
            { title: 'TriggeredBy', field: 'TriggeredBy' },
        ]);
    }, [orders]);

    const handleClickCancle = (event, rowData) => {
        console.log(orderInfo)
		// setConfirmOpen(false);
        // http.deletePurchaseOrder(orderInfo.OrderID, orderCancled);
        orderCancled();
    };

	const orderCancled = () => {
		reloadOrders();
	};
    
	const handleClickUpdate = (order) => {
		const type = order.Type.toUpperCase().replace(' ', '');
		setOrderType((type === 'BUY' || type === 'SELLSHORT' || order.StopPrice === 0) ? 'Limit' : 'StopMarket');
		setStopPrice(order.StopPrice);
		setLimitPrice(order.LimitPrice);
		const cIsTrailingStop = order.TrailingStop ? true : false;
		setIsTrailingStop(cIsTrailingStop);
		setTrailingStop(orderInfo.TrailingStop ? order.TrailingStop.Amount : 0);
		setOrderInfo(order);
		setUpdateOpen(true);
    };

	const handleSendOrderClick = () => {
		
		setUpdateOpen(false);
		var payload = {
			order_id: orderInfo.OrderID,
			payload:{
				Symbol: orderInfo.Symbol,
				OrderType: orderType,
				StopPrice: stopPrice,
				LimitPrice: limitPrice,
				Quantity: orderInfo.Quantity,
			}
		};

		if(isTrailingStop){
			payload = {
				order_id: orderInfo.OrderID,
				payload:{
					Symbol: orderInfo.Symbol,
					OrderType: orderType,
					StopPrice: stopPrice,
					LimitPrice: limitPrice,
					Quantity: orderInfo.Quantity,
					AdvancedOptions: {
						TrailingStop: {
							Amount: parseFloat(trailingStop).toFixed(2),
						}
					}
				}
			};
		}
		console.log(payload);
		if((parseFloat(stopPrice) !== orderInfo.StopPrice || parseFloat(limitPrice) !== orderInfo.LimitPrice) && (!stopError || !limitError)) {
			http.updatePurchaseOrder(payload, orderUpdated);
		} 
	};

	const orderUpdated = (data) => {
		console.log(data);
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
		const price = parseFloat(e.target.value);
		const type = orderInfo.Type.toUpperCase().replace(' ', '');
		const ts =  orderInfo.StopPrice - price;
		// console.log(ts, orderInfo.TrailingStop.Amount, orderInfo.StopPrice, price, orderInfo,orderInfo.type)
		orderInfo.TrailingStop && setTrailingStop(parseFloat(type === 'SELL' ? ts + orderInfo.TrailingStop.Amount : orderInfo.TrailingStop.Amount - ts).toFixed(2));
		switch (e.target.name) {
			case 'STOPPRICE':
				if(limitPrice !== 0 && price > limitPrice){
					setStopError(true);
					setStopErrorText(`Stop price cannot be greater than ${limitPrice}.`);
				} else {
					setStopError(false);
					setStopErrorText('');
					setStopPrice(price);
				}
				break;

			case 'LIMITPRICE':
				if(stopPrice !== 0 && price < stopPrice){
					setLimitError(true);
					setLimitErrorText(`Limit price cannot be less than ${stopPrice}.`);
				} else {
					setLimitError(false);
					setLimitErrorText('');
					setLimitPrice(price);
				}
				break;
			
			case 'TRAILINGSTOP':
				
				break;

			default:
				break;
		}
	}

    return (
        <div className={classes.root}>
            <MaterialTable
                icons={tableIcons}
                title="Today's Orders"
                columns={columns}
                data={data}
                // style={{height: containerHeight}}
                actions={[
                    {
                        icon: (() => <Cached />),
                        tooltip: 'Refresh Data',
                        isFreeAction: true,
                        onClick: (() => reloadOrders())
                    },
                    {
                      icon: (() => <Edit />),
                      tooltip: 'Edit Order',
                    //   disabled:  rowData => {return rowData.StatusDescription !== 'Queued' && rowData.StatusDescription !== 'Received'},
                    //   onClick: (event, rowData) => (rowData.StatusDescription === 'Queued' || rowData.StatusDescription === 'Received') && handleClickUpdate(rowData)
                      onClick: (event, rowData) => handleClickUpdate(rowData)
                    },
                    {
                      icon: (() => <DeleteOutline />),
                      tooltip: 'Cancle Order',
                      onClick: (event, rowData) => handleConfirmDialog(rowData)
                    }
                ]}
                options={{
                    headerStyle: styles.headerStyle,
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 15, 20],
                    minBodyHeight: containerHeight,
                    actionsCellStyle: styles.actionsCellStyle,
                    rowStyle: rowData => (rowData.StopPrice === 0 ? styles.profit : rowData.LimitPrice === 0 ? styles.loss : styles.purchase),
                }}
            />
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
                            <Grid item xs={4}>
                                <TextField
                                    id="QUANTITY"
                                    name="QUANTITY"
                                    label="QUANTITY"
                                    InputProps={{ readOnly: true, }}
                                    defaultValue={orderInfo.Quantity}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="ORDERID"
                                    label="ORDER ID"
                                    InputProps={{ readOnly: true, }}
                                    defaultValue={orderInfo.OrderID}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    id="TRAILINGSTOP"
                                    label="TRAILING STOP"
                                    value={trailingStop}
                                    onChange={handleTextChange}
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
        </div>
    )
}

export default OrdersTable

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const styles = {
    headerStyle: {
        backgroundColor: '#3f51b5',
        color: 'white',
        padding: 5,
    },
    actionsCellStyle: {        
        padding: '0px 8px',
    },
	profit: {
		backgroundColor: 'lightgreen',
	},
	loss: {
		backgroundColor: 'pink',
	},
    purchase: {

    }
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    actionIcon:{
        padding: '0px 8px',
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
}));
