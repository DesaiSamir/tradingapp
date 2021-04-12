import React from "react";
import IconLink from "../buttons/IconLink";
import Github from "../../res/footer-github.png";
import { makeStyles } from '@material-ui/core/styles';

const Footer = () => {
	const classes =useStyles();
    return (
        <div className={classes.footer}>
            <span>
                Developed by <a href="https://github.com/DesaiSamir/tradingapp">Samir Desai</a>. 
                {/* , with project scaffolding from <a href="https://github.com/rmbh4211995/passport-react">RyanMichael</a>. */}
            </span>
            <IconLink
                href={"https://github.com/DesaiSamir/tradingapp"}
                icon={Github}
                title="Github"
                className={classes.socialIcon}
                buttonStyle={{ verticalAlign: "top" }}
            />
        </div>
    );
};

export default Footer;


const useStyles = makeStyles((theme) => ({
	footer: {
        backgroundColor: '#26C6DA',
        bottom:0,
        position: 'fixed',
        // boxShadow: '0 -4px 10px 0px rgba(0,0,0,0.8)',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        padding: '10px',
      },
    socialIcon: {
        width: '24px',
        height: '24px',
        transition: 'all ease-in-out 0.6s',
        "&:hover": {
            transform: 'translateY(-5px)',
        }
    }
}));