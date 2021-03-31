import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserDropDown from "./UserDropDown";
import UserProvider from "../../contexts/UserProvider";
import { data } from "../../data";
import _ from "lodash";
import TradestationLogo from "../../res/ts_logo.png";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LogoutIcon from "@material-ui/icons/MeetingRoom";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const MenuBar = () => {
    const userData = useContext(UserProvider.context);
    const loginType = !_.isEmpty(userData) ? _.find(data, d => d.name === userData.provider) : {};

    return (
        <div className="menu-bar">
            {
                !_.isEmpty(userData) &&
                <Link className="btn menu-btn" to="/profile" title={`${loginType.name} data`}>
                    <div className="app-icon-container" style={{ backgroundColor: loginType.color }}>
                        <img
                            className="btn-icon"
                            src={loginType.img}
                            alt={loginType.alt}
                            style={{ position: "absolute", top: 17, paddingLeft: 5 }}
                        />
                    </div>
                </Link>
            }

            {
                _.isEmpty(userData) &&
                <a className="btn menu-btn disabled" href="/">
                    <img
                        src={TradestationLogo}
                        alt="passport.js logo"
                        style={{ height: 19 }}
                    />
                </a>
            }

            <Link className="btn menu-btn" to="/" title="Home">
                <HomeIcon />
            </Link>

            <Link className="btn menu-btn" to="/market" title="Market">
                <TrendingUpIcon />
            </Link>

            <UserDropDown />

            {   
                
                !_.isEmpty(userData) &&
                <a
                    className="btn menu-btn"
                    href={"api/logout"}
                    title="Logout"
                    style={{ float: "right" }}
                >
                    <LogoutIcon />
                </a>
            }

            {
                !_.isEmpty(userData) &&
                <Link 
                    className="btn menu-btn" 
                    to="/profile" 
                    title="Profile" 
                    style={{ float: "right" }}>
                    <AccountCircleIcon />
                </Link>
            }
        </div>
    );
};


export default MenuBar;