import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import http from "../utils/http";
import OrdersTable from "../components/displays/OrdersTable";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Orders = ({userData}) => {
    const classes = useStyles();
    const [ordersData, setOrdersData] = useState([]);
    const [accountKey, setAccountKey] = useState();

    useEffect(() => {
        
    },[]);

    const ordersCallback = (orders) => {
        setOrdersData(orders);
    }
    console.log({condition: !accountKey && ordersData.length === 0, accountKey, length: ordersData.length, ordersData})
    if(!accountKey || ordersData.length === 0){
        
        console.log(accountKey, ordersData)
        const account = userData.user_data.filter(item => item.Type === 'M')[0];
        setAccountKey(account.Key);
        http.getAccountOrders(account.Key, ordersCallback);
    }

    return (
        <div className={classes.root}>
            <OrdersTable
                ordersData={(ordersData && ordersData.retOrders) && ordersData.retOrders}
            />
        </div>
    )
}

export default Orders
