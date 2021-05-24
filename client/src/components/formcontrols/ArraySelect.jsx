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

export default function SimpleSelect({menuItems, name, onSelectChange, title, defaultValue}) {
	const classes = useStyles();
	const [value, setValue] = React.useState(defaultValue);
	const handleClick = (val) => {
		setValue(val);
	}
	return (
		<div >
			<FormControl className={classes.formControl}>
				<InputLabel id="array-select-label">{title}</InputLabel>
				<Select
					labelId="array-select"
					id={name}
                    name={name}
					value={value}
					onChange={onSelectChange}
				>
					{menuItems.map((item) => ( <MenuItem value={item} name={name} key={item} onClick={() => handleClick(item)}>{item}</MenuItem> ))}

				</Select>
			</FormControl>
		</div>
	);
}
