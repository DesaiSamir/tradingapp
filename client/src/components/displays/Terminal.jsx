import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const Terminal = ({ userData, title = 'Terminal'}) => {
    const classes = useStyles();
    const selectedData = userData;
    const jsonCode = JSON.stringify(selectedData, null, 4);
    
    return (
        <div className={classes.window} >
            <div className={classes.titleBar}>
                <div className={classes.buttons}>
                    <div className={`${classes.macBtn} ${classes.close}`} />
                    <div className={`${classes.macBtn} ${classes.minimize}`} />
                    <div className={`${classes.macBtn} ${classes.zoom}`} />
                </div>
                <p style={{ textAlign: "center", margin: 0 }}>
                    {title}
                </p>
            </div>
            <div className={classes.content}>
                <pre>{jsonCode}</pre>
            </div>
        </div>
    );
};

export default Terminal;


const useStyles = makeStyles((theme) => ({
    window: {
        width: '100%',
        background: 'white',
        borderRadius: '6px',
        margin: '10px',
        fontSize: '20px',
        overflow: 'hidden'
    },
    content: {
        backgroundColor: '#EEEEEE',
        padding: '20px 10px',
        borderBottomLeftRadius: '6px',
        borderBottomRightRadius: '6px',
        overflowY: 'auto',
        height: '670px',
    },
    titleBar: {
        backgroundColor: 'rgb(109, 106, 106)',
        borderTopRightRadius: '6px',
        borderTopLeftRadius: '6px',
        color: '#ffffff',
        paddingTop: '5px',
        paddingBottom: '5px',
    },
    buttons: {
        float: 'left',
        paddingLeft: '8px',
        paddingTop: '3px',
        lineHeight: 0,
    },
    macBtn:{
        fontSize: '9px',
        width: '11px',
        height: '11px',
        display: 'inline-block',
        borderRadius: '50%',
    },
    close: {
        background: '#ff5c5c',
        border: '1px solid #ff5c5c',
    },
    minimize: {
        background: '#ffbd4c',
        border: '1px solid #ffbd4c',
        marginLeft: '4px',
    },
    zoom: {
        background: '#00ca56',
        border: '1px solid #00ca56',
        marginLeft: '4px',
    },
  }));