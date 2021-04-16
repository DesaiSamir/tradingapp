import React, { useState, useEffect } from "react";
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
        const payload = {
            method: 'POST',
            url: '/v2/orders',
            payload: {
                Symbol: 'SPY',
                AccountKey: '789891384',
                AssetType: 'EQ',
                Duration: 'DAY',
                OrderType: 'StopLimit',
                StopPrice: '414.50',
                LimitPrice: '414.55',
                Quantity: '1',
                TradeAction: 'BUY',
                OSOs: [
                    {
                        Type: 'NORMAL',
                        Orders: [
                            {
                                Symbol: 'SPY',
                                AccountKey: '789891384',
                                AssetType: 'EQ',
                                Duration: 'DAY',
                                OrderType: 'StopMarket',
                                StopPrice: '413.50',
                                Quantity: '1',
                                TradeAction: 'SELL',
                            }
                        ]
                    }
                ],
            } 
        };
        http.postPurchaseOrder(payload, orderResponse);
    };

    const orderResponse = (data) => {
        setOrderResponseData(data);
    }
    
    return (
        <Paper>
            <Button variant="contained" color="primary" onClick={handleClick} className={classes.spacer} >Purchase Order</Button>
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