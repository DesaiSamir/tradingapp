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
        backgroundColor: '#3f51b5',
        bottom:0,
        position: 'fixed',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        padding: '10px',
        zIndex: 2000,
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