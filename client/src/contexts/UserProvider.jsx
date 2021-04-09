import React, { createContext, useState, useEffect } from "react";
const context = createContext(null);
const http = require("../utils/http");

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        http.get("api/profile", setUser);
    }, []);

    return (
        <context.Provider value={user}>
            {children}
        </context.Provider>
    );
};

UserProvider.context = context;

export default UserProvider;