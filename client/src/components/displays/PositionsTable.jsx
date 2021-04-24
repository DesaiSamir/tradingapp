import { useContext } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
      height: (window.innerHeight - 227),
  },
  container: {
    maxHeight: window.innerHeight - 115,
  },
});

export default function PositionsTable() {
    const classes = useStyles();
    const { positions } = useContext(UserProvider.context);
    
    return (
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
                </TableRow>
            </TableHead>
            <TableBody>
            {positions.map((order) => (
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
    );
}