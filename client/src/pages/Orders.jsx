import { makeStyles } from '@material-ui/core/styles';
import OrdersTable from "../components/displays/OrdersTable";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Orders = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
                <OrdersTable />
        </div>
    )
}

export default Orders
