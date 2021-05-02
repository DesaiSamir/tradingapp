import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";
export const BalanceContext = createContext(null);
const http = require("../utils/http");

const BalanceProvider = ({ children }) => {
    const { equitiesAccountKey } = useContext(UserContext);
    const [balanceInfo, setBalanceInfo] = useState(null);
    const [balAccountName, setBalAccountName] = useState(null);
    const [accountBalance, setAccountBalance] = useState(null);
    const [realizedPnL, setRealizedPnL] = useState(null);
    const [unRealizedPnL, setUnRealizedPnL] = useState(null);
    const [netWorth, setNetWorth] = useState(null);
    const [positionCost, setPositionCost] = useState(null);
    const [overnightBuyPower, setOvernightBuyPower] = useState(null);
    const [dayBuyPower, setDayBuyPower] = useState(null);
    
    useEffect(() => {
        const callback = (data) => {
            const bInfo = data[0];
            if(bInfo){
                setBalanceInfo(bInfo);
                setBalAccountName(bInfo.DisplayName);
                setAccountBalance(bInfo.RealTimeAccountBalance);
                setRealizedPnL(bInfo.RealTimeRealizedProfitLoss);
                setUnRealizedPnL(bInfo.RealTimeUnrealizedProfitLoss);
                setNetWorth(bInfo.RealTimeEquity);
                setPositionCost(bInfo.RealTimeCostOfPositions);
                setOvernightBuyPower(bInfo.RealTimeOvernightBuyingPower);
                setDayBuyPower(bInfo.RealTimeBuyingPower);
            }
        }

        if(equitiesAccountKey){
            http.getAccountBalances(equitiesAccountKey, callback);
        }
    }, [equitiesAccountKey]);
    
    return (
        <BalanceContext.Provider value={{
            balanceInfo, balAccountName, 
            accountBalance, realizedPnL, unRealizedPnL,
            netWorth, positionCost, overnightBuyPower, dayBuyPower,
        }}>
            {children}
        </BalanceContext.Provider>
    );
};

export default BalanceProvider;