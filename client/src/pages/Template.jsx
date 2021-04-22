// import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Template = ({}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>

        </div>
    )
}

export default Template
