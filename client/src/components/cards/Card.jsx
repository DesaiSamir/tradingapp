import React from "react";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    card: {
        background: 'white',
        borderRadius: '2px',
        display: 'inline-block',
        marginRight: '2em',
        boxShadow: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
        transition: 'all ease-in-out 0.6s',
        "&:hover": {
            transform: 'translateY(-10px)',
        },
    },
  }));

  
const Card = ({ img, name, href, color }) => {
    const classes = useStyles();
    const NAME = name.charAt(0).toUpperCase() + name.substring(1, name.length);

    return (
        <div
            className={classes.card}
            style={{ border: `1px solid ${color}`, borderRadius: 2 }}
            onClick={() => window.location = href}
        >
            <div>
                <p style={{ margin: 0, textAlign: "left", padding: "5px 0px 5px 10px" }}>
                    {NAME}
                </p>
            </div>
            <div
                style={{
                    minHeight: 100,
                    minWidth: 100,
                    background: `url("${img}") no-repeat center center / 50% ${color}`
                }}
            />
        </div>
    );
 };

export default Card;