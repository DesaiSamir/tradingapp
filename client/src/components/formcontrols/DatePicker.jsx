import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import helper from "../../utils/helper";

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'inline-block',
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200,
		paddingTop: '8px',
	},
}));

export default function DatePickers({title, name, onDateChange, parentStyles}) {
  	const classes = useStyles();
	const parentClasses = parentStyles ? parentStyles() : classes;

  return (
		<form className={`${classes.container} ${parentClasses.selectDivChild}`} noValidate>
			
			<TextField
				id = {name}
				label = {title}
				type = "date"
				defaultValue = {helper.formatDate(new Date(), 'yyyy-mm-dd' )}
				className = {classes.textField}
				InputLabelProps = {{
				shrink: true,
				}}
				onChange={(e) => onDateChange(e, name)}
			/>
		</form>
	);
}