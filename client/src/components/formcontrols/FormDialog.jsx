import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {
	Fab, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';


const useStyles = makeStyles((theme) => ({
    buttonStyle: {
        backgroundColor: "#3f51b5",
        margin: '3px',
    },
}));

export default function FormDialog() {
	const [open, setOpen] = useState(false);
	const classes = useStyles();
	const { handleAddWatchlist } = useContext(ChartActionsContext);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Fab color="primary" aria-label="add" onClick={handleClickOpen} className={classes.buttonStyle}>
				<AddIcon />
			</Fab>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Enter Stock Symbol</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="addStockSymbol"
						label="Stock Symbol"
						type="text"
						onKeyDown={(e) => handleAddWatchlist(e, setOpen)} 
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={(e) => handleAddWatchlist(e, setOpen)}  color="primary">
						Add To Watchlist
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
