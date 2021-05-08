import { useContext } from 'react';
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

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
	padding: 5,
  },
  body: {
    fontSize: 14,
    color: theme.palette.common.white,
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
    const { positions } = useContext(OrderContext);
	const { setSymbolText } = useContext(ChartActionsContext);
    // console.log(positions)
    return (
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
					</TableRow>
				</TableHead>
				<TableBody>
					{positions && positions.map((order) => (
						<StyledTableRow 
							key={order.TimeStamp} 
							onClick={() => setSymbolText(order.Symbol)}
							className={
								`${order.OpenProfitLoss === 0 
								? classes.is0 
								: order.OpenProfitLoss > 0
									? order.OpenProfitLoss > 200 ? classes.up200 : order.OpenProfitLoss > 50 ? classes.up50 : classes.up 
									: order.OpenProfitLoss < -200 ? classes.down200 : order.OpenProfitLoss < -50 ? classes.down50 : classes.down}
								${classes.row}`} 
						>
							<StyledTableCell>{order.Symbol}</StyledTableCell>
							<StyledTableCell>{order.Description}</StyledTableCell>
							<StyledTableCell>{order.Quantity}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.OpenProfitLoss).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.AveragePriceDisplay).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.LastPriceDisplay).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.TodaysProfitLoss).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.OpenProfitLossQty).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.OpenProfitLossPercent).toFixed(2)} %</StyledTableCell>
							<StyledTableCell>{parseFloat(order.TotalCost).toFixed(2)}</StyledTableCell>
							<StyledTableCell>{parseFloat(order.MarketValue).toFixed(2)}</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
        </TableContainer>
    );
}