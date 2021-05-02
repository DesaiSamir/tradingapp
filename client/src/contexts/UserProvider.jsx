import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext(null);
const http = require("../utils/http");

const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [accounts, setAccounts] = useState(null);
    const [equitiesAccountKey, setEquitiesAccountKey] = useState(null);
    
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
        }

        http.getProfileData(userProfileData);
    }, []);

    return (
        <UserContext.Provider value={{
            userProfile, 
            userId, 
            accounts, 
            equitiesAccountKey, 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;