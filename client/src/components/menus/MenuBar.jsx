import UserDropDown from "./UserDropDown";
import { data } from "../../data";
import _ from "lodash";
import { makeStyles } from '@material-ui/core/styles';
import TradestationLogo from "../../res/ts_logo.png";
import LogoutIcon from "@material-ui/icons/MeetingRoom";

const useStyles = makeStyles((theme) => ({
    menuBar: {
        overflow: 'hidden',
        backgroundColor: '#26C6DA',
        height: '50px',
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

const MenuBar = ({userData}) => {
    const classes = useStyles();
    const loginType = !_.isEmpty(userData) ? _.find(data, d => d.name === userData.provider) : {};

    return (
        <div className={classes.menuBar}>
            {
                !_.isEmpty(userData) &&
                <div className={`${classes.btn} ${classes.menuBtn}`} title={`${loginType.name} data`}>
                    <div className={classes.appIconContainer} style={{ backgroundColor: loginType.color }}>
                        <img
                            className={classes.btnIcon}
                            src={loginType.img}
                            alt={loginType.alt}
                            style={{ position: "absolute", top: 17, paddingLeft: 5 }}
                        />
                    </div>
                </div>
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
            
        </div>
    );
};

export default MenuBar;
