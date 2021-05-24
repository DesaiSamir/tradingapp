import React, { createContext, useState, useEffect } from "react";
export const UserContext = createContext(null);
const http = require("../utils/http");

const UserProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [accounts, setAccounts] = useState(null);    
    const [equitiesAccountKey, setEquitiesAccountKey] = useState(null);
    const [settings, setSettings] = useState(null);
    const [settingUnits, setSettingUnits] = useState(null);
    const [userSettings, setUserSettings] = useState(null);
    
    useEffect(() => {
        const userProfileData = (data) => {

            setUserProfile(data);
            const id = data.userid;
            setUserId(id);
            setUsername(id);
            http.getAccounts(id, userAccounts);
            http.getUserSettings(id, setUserSettings);
        }
        const userAccounts = (data) => {
            
            setAccounts({data});

            const key = data.filter(item => item.Type === 'M')[0].Key;
            setEquitiesAccountKey(key);
        }

        http.getProfileData(userProfileData);
        http.getSettings(setSettings);
        http.getSettingUnits(setSettingUnits);
    }, []);

    const reloadSettings = () => {        
        http.getSettings(setSettings);
        http.getSettingUnits(setSettingUnits);
    }

    const saveSettings = (updatedSettings) => {
        const payload = updatedSettings;
        http.saveSettings(payload, settingSaved);
        console.log(updatedSettings);
    }

    const settingSaved = (data) => {
        console.log(data);
        reloadSettings();
    }

    return (
        <UserContext.Provider value={{
            userProfile, 
            userId, username,
            accounts, 
            equitiesAccountKey,
            settings, userSettings, settingUnits, reloadSettings, saveSettings
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;