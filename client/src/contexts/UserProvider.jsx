import React, { createContext, useState, useEffect } from "react";
export const UserContexxt = createContext(null);
const http = require("../utils/http");

const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [equitiesAccountKey, setEquitiesAccountKey] = useState(null);
    const [balances, setBalances] = useState(null);
    const [positions, setPositions] = useState(null);
    const [orders, setOrders] = useState(null);
    
    useEffect(() => {
        const userProfileData = (data) => {

            setUserProfile(data);
            const id = data.userid;
            setUserId(id);
            
            http.getAccounts(id, userAccounts);
        }
        const userAccounts = (data) => {
            
            setAccounts({data});

            const key = data.filter(item => item.Type === 'M')[0].Key;
            setEquitiesAccountKey(key);
            http.getAccountBalances(key, setBalances);
            http.getAccountPositions(key, setPositions);
            http.getAccountOrders(key, setOrders);
        }

        http.getProfileData(userProfileData);
    }, []);
    
    return (
        <UserContexxt.Provider value={{userProfile, userId, accounts, equitiesAccountKey, balances, positions, orders}}>
            {children}
        </UserContexxt.Provider>
    );
};

export default UserProvider;