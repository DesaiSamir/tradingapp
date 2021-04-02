import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserDropDown from "./UserDropDown";
import UserProvider from "../../contexts/UserProvider";
import { data } from "../../data";
import _ from "lodash";
import { makeStyles } from '@material-ui/core/styles';
import TradestationLogo from "../../res/ts_logo.png";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import LogoutIcon from "@material-ui/icons/MeetingRoom";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const useStyles = makeStyles((theme) => ({
    menuBar: {
        overflow: 'hidden',
        backgroundColor: 'var(--primary-red)',
        height: '56px',
    },
    btn: {
        textDecoration: 'none',
        color: 'white',
        "&:hover" : {
            opacity: 0.8
        }
    },
    menuBtn: {
        padding: '12px 15px',
        display: 'inline-block',
        "&:hover": {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '50%',
        },
    },
    btnIcon: {
        width: '15px',
        verticalAlign: 'middle',
        display: 'inline-block',
    },
    loginBtn: {
        padding: '5px 20px',
        borderRadius: '3px',
    },
    disabled: {
        pointerEvents: 'none',
    },
    btnTxt: {
        paddingLeft: '10px',
        verticalAlign: 'middle',
    },
    appIconContainer: {
        width: '1em',
        height: '1em',
        display: 'inline-block',
        fontSize: '1.5rem',
        borderRadius: '50%',
    },
  }));

const MenuBar = () => {
    const classes = useStyles();
    const userData = useContext(UserProvider.context);
    const loginType = !_.isEmpty(userData) ? _.find(data, d => d.name === userData.provider) : {};

    return (
        <div className={classes.menuBar}>
            {
                !_.isEmpty(userData) &&
                <Link className={`${classes.btn} ${classes.menuBtn}`} to="/profile" title={`${loginType.name} data`}>
                    <div className={classes.appIconContainer} style={{ backgroundColor: loginType.color }}>
                        <img
                            className={classes.btnIcon}
                            src={loginType.img}
                            alt={loginType.alt}
                            style={{ position: "absolute", top: 17, paddingLeft: 5 }}
                        />
                    </div>
                </Link>
            }

            {
                _.isEmpty(userData) &&
                <a className={`${classes.btn} ${classes.menuBtn} ${classes.disabled}`} href="/">
                    <img
                        src={TradestationLogo}
                        alt="passport.js logo"
                        style={{ height: 19 }}
                    />
                </a>
            }

            <Link className={`${classes.btn} ${classes.menuBtn}`} to="/" title="Home">
                <HomeIcon />
            </Link>

            <Link className={`${classes.btn} ${classes.menuBtn}`} to="/market" title="Market">
                <TrendingUpIcon />
            </Link>

            <UserDropDown styles={classes} />

            {   
                
                !_.isEmpty(userData) &&
                <a
                    className={`${classes.btn} ${classes.menuBtn}`}
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
                    className={`${classes.btn} ${classes.menuBtn}`}
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
