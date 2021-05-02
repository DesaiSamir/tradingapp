import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Terminal from '../displays/Terminal';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
}));

export default function AlertDialog({jsonData, showResponse, setShowResponse}) {
    const classes = useStyles();
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setShowResponse(false);
	};

	if(showResponse && !open){
		setOpen(true);
	}

	return (
		<div className={classes.root}>
			<Button variant="outlined" color="primary" onClick={handleClickOpen}>
				Open alert dialog
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth='lg'
				fullWidth={true}
			>
				<DialogContent>
					<Paper id="alert-dialog-description">
						<Terminal
							title="Order Response"
							jsonData={jsonData} 
						/>
					</Paper>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary" autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
