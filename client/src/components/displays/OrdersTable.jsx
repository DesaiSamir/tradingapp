import { useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { 
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
} from '@material-ui/core';
import UserProvider from '../../contexts/UserProvider';

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

const useStyles = makeStyles({
	table: {
		minWidth: 700,
	},
	rows: {
		overflowY: 'auto',
	},
	container: {
		minHeight: (window.innerHeight - 227) / 2,
	},
});

export default function OrdersTable() {
    const classes = useStyles();
    const { orders } = useContext(UserProvider.context);
    
    return (
		<Grid container>
			<Grid item xs={12} className={classes.container} > 
				<TableContainer component={Paper}>
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
							</TableRow>
						</TableHead>
						<TableBody className={classes.rows} >
							{orders.retOrders.map((order) => (
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
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item xs={12} className={classes.container}>
				<TableContainer component={Paper} >
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
								<StyledTableCell>RejectReason</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody className={classes.rows}>
							{orders.dbOrders.map((order) => (
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