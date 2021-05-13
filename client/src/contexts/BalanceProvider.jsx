import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";
export const BalanceContext = createContext(null);
const http = require("../utils/http");

const BalanceProvider = ({ children }) => {
    const { equitiesAccountKey } = useContext(UserContext);
    const [balanceInfo, setBalanceInfo] = useState(null);
    const [balAccountName, setBalAccountName] = useState(null);
    const [accountBalance, setAccountBalance] = useState(0.00);
    const [realizedPnL, setRealizedPnL] = useState(0.00);
    const [unRealizedPnL, setUnRealizedPnL] = useState(0.00);
    const [netWorth, setNetWorth] = useState(0.00);
    const [positionCost, setPositionCost] = useState(0.00);
    const [overnightBuyPower, setOvernightBuyPower] = useState(0.00);
    const [dayBuyPower, setDayBuyPower] = useState(0.00);
    const [closedPositions, setClosedPositions] = useState(null);
    
    useEffect(() => {
        const callback = (data) => {
            const bInfo = data[0];
            if(bInfo){
                setBalanceInfo(bInfo);
                setBalAccountName(bInfo.DisplayName);
                setAccountBalance(parseFloat(bInfo.RealTimeAccountBalance).toFixed(2));
                setRealizedPnL(parseFloat(bInfo.RealTimeRealizedProfitLoss).toFixed(2));
                setUnRealizedPnL(parseFloat(bInfo.RealTimeUnrealizedProfitLoss).toFixed(2));
                setNetWorth(parseFloat(bInfo.RealTimeEquity).toFixed(2));
                setPositionCost(parseFloat(bInfo.RealTimeCostOfPositions).toFixed(2));
                setOvernightBuyPower(parseFloat(bInfo.RealTimeOvernightBuyingPower).toFixed(2));
                setDayBuyPower(parseFloat(bInfo.RealTimeBuyingPower).toFixed(2));
                setClosedPositions(bInfo.ClosedPositions);
            }
        }

        if(equitiesAccountKey){
            http.getAccountBalances(equitiesAccountKey, callback);
        }
    }, [equitiesAccountKey]);
    
    return (
        <BalanceContext.Provider value={{
            balanceInfo, balAccountName, accountBalance, 
            realizedPnL, unRealizedPnL, closedPositions,
            netWorth, positionCost, overnightBuyPower, dayBuyPower,
        }}>
            {children}
        </BalanceContext.Provider>
    );
};

export default BalanceProvider;