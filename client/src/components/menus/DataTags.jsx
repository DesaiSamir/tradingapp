import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	tag: {
		color: 'var(--primary-red)',
        display: 'inline-block',
        padding: '5px 10px',
        border: '1px solid var(--primary-red)',
        borderRadius: '5px',
        marginRight: '10px',
        marginBottom: '10px',
        "&:hover, .selected": {
            backgroundColor: 'var(--primary-red)',
            color: 'white',
        }
    },
    pStyle: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        margin: 2,
        fontSize: 12
    }
}));

const DataTags = ({ options, onClick, selected }) => {
	const classes = useStyles();
    const ;
    const allOptions = ["All", ...options];

    return (
        <div style={{width: '50%', margin: '10px'}}>
            {allOptions.map(option => {
                const extraClass = option === selected ? "selected" : "";

                return (
                    <div
                        key={option}
                        onClick={() => onClick(option)}
                        className={`${classes.tag} ${extraClass}`}
                        title={option}
                    >
                        <p className={classes.pStyle}>{option}</p>
                    </div>
                )
            })}
        </div>
    );
};

export default DataTags;