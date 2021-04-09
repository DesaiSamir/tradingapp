import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
		margin: theme.spacing(1),
		width: '15ch',
		},
	},
	selectDivChild:{

	}
}));

export default function SimpleTextFields({id, label, name, onChange, defaultValue, parentStyles, type}) {
  	const classes = useStyles();
	const parentClasses = parentStyles ? parentStyles() : classes;
	
	return (
		<form className={`${classes.root} ${parentClasses.selectDivChild}`} noValidate autoComplete="off">
			<TextField 
				id = {id} 
				label = {label} 
				type = {type}
				// variant = "filled" 
				onKeyDown = {(e) => onChange(e, name)} 
				// onChange = {(e) => onChange(e, name)} 
				defaultValue = {defaultValue}
			/>
		</form>
	);
}