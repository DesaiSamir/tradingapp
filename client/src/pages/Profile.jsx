import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Terminal from "../components/displays/Terminal";
import { Button, Paper, Grid } from "@material-ui/core";
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

const Profile = ({userData}) => {
    const classes = useStyles();
    const [orderResponseData, setOrderResponseData] = useState({});

    const handleClick= (e) => {
        e.preventDefault();
        var currentTime = new Date();
        const OrderConfirmId = 'SPY15M' + currentTime.getHours() + currentTime.getMinutes() + currentTime.getSeconds();
        const payload = {
            Symbol: 'SPY',
            AccountKey: '789891384',
            AssetType: 'EQ',
            Duration: 'GTC',
            OrderType: 'StopLimit',
            StopPrice: '418.00',
            LimitPrice: '418.05',
            Quantity: '1',
            TradeAction: 'BUY',
            OrderConfirmId: 'BUY' + OrderConfirmId,
            OSOs: [
                {
                    Type: 'NORMAL',
                    Orders: [
                        {
                            Symbol: 'SPY',
                            AccountKey: '789891384',
                            AssetType: 'EQ',
                            Duration: 'GTC',
                            OrderType: 'StopMarket',
                            StopPrice: '417.50',
                            Quantity: '1',
                            TradeAction: 'SELL',
                            OrderConfirmId: 'SELL' + OrderConfirmId,
                        }
                    ]
                }
            ],
        };
        http.postPurchaseOrder(payload, orderResponse);
    };
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

    const orderResponse = (data) => {
        setOrderResponseData(data);
    }
    
    return (
        <Paper>
            <Button variant="contained" color="primary" onClick={handleClick} className={classes.spacer} >Purchase Order</Button>
            <Button variant="contained" color="primary" onClick={handleClickUpdate} className={classes.spacer} >Update Order</Button>
            <Button variant="contained" color="primary" onClick={handleClickDelete} className={classes.spacer} >Delete Order</Button>
            <Grid container>
                <Grid item xs={6}> 
                    <Terminal
                        userData={userData}
                        title="Profile Data"
                    />
                </Grid>
                <Grid item xs={6}> 
                    <Terminal
                        userData={orderResponseData}
                        title="Profile Data"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Profile;