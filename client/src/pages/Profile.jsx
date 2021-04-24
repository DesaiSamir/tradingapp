import React, { useState ,useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Terminal from "../components/displays/Terminal";
import { Button, Paper, Grid } from "@material-ui/core";
import UserProvider from "../contexts/UserProvider";
const http = require("../utils/http");


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "5px",
    },
	spacer: {
        margin: "25px",
	},
    stockList:{
        height: `calc(100% - 62px)`,
    },
    watchlistBar:{
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {
        padding: '16px',
    },
}));

const Profile = () => {
    const classes = useStyles();
    const [orderResponseData, setOrderResponseData] = useState({});
    const { equitiesAccountKey, userProfile } = useContext(UserProvider.context);
   
    const handleClickUpdate= (e) => {
        e.preventDefault();
        const payload = {
            order_id: '655524549',
            payload:{
                Symbol: 'SPY',
                OrderType: 'StopMarket',
                StopPrice: '417.00',
                Quantity: '1',
            }
        };
        http.updatePurchaseOrder(payload, orderResponse);
    };

    const handleClickDelete= (e) => {
        e.preventDefault();
        const payload = {
            order_id: '655524550',

        };
        http.deletePurchaseOrder(payload, orderResponse);
    };
    
    const handleClickGetOrders= (e) => {
        e.preventDefault();
        const url = `/v2/accounts/${equitiesAccountKey}/orders`;
        const payload = {
            method: 'GET',
            url: url 
        };
        http.getAccountOrders(payload, setOrderResponseData);
    };
    
    const handleClickGetPositions= (e) => {
        e.preventDefault();
        const url = `/v2/accounts/${equitiesAccountKey}/positions`;
        const payload = {
            method: 'GET',
            url: url 
        };
        http.getAccountPositions(payload, setOrderResponseData);
    };
    
    const handleClickGetBalances= (e) => {
        e.preventDefault();
        const url = `/v2/accounts/${equitiesAccountKey}/balances`;
        const payload = {
            method: 'GET',
            url: url 
        };
        http.getAccountPositions(payload, setOrderResponseData);
    };

    const orderResponse = (data) => {
        setOrderResponseData(data);
    }
    
    return (
        <Paper>
            <Button variant="contained" color="primary" onClick={handleClickUpdate} className={classes.spacer} >Update Order</Button>
            <Button variant="contained" color="primary" onClick={handleClickDelete} className={classes.spacer} >Delete Order</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetOrders} className={classes.spacer} >Get Orders</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetPositions} className={classes.spacer} >Get Positions</Button>
            <Button variant="contained" color="primary" onClick={handleClickGetBalances} className={classes.spacer} >Get Balances</Button>
            <Grid container>
                <Grid item xs={6}> 
                    <Terminal
                        jsonData={userProfile}
                        title="Profile Data"
                    />
                </Grid>
                <Grid item xs={6}> 
                    <Terminal
                        jsonData={orderResponseData}
                        title="Profile Data"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Profile;