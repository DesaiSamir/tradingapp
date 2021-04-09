import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export default function SimpleSelect({menuItems, name, onSelectChange, title, parentStyles, defaultValue}) {
	const classes = useStyles();
	const parentClasses = parentStyles ? parentStyles() : classes;
	const [api, setApi] = React.useState(defaultValue);
	const handleClick = (id) => {
		setApi(id);
	}
	return (
		<div className={parentClasses.selectDivChild}>
			<FormControl className={classes.formControl}>
				<InputLabel id="simple-select-label">{title}</InputLabel>
				<Select
					labelId="simple-select"
					id={name}
					value={api}
					onChange={(e) => onSelectChange(e, name, menuItems)}
				>
					{menuItems.map((item) => ( <MenuItem value={item.id} key={item.id} onClick={() => handleClick(item.id)}>{item.title}</MenuItem> ))}

				</Select>
			</FormControl>
		</div>
	);
}
