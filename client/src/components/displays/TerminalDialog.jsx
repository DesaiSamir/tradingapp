import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Terminal from './Terminal';

export default function AlertDialog({jsonData, showResponse, setShowResponse}) {
	const [open, setOpen] = React.useState(false);
	console.log({jsonData, showResponse});
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
		<div>
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
				<DialogContentText id="alert-dialog-description">
					<Terminal
						title="Order Response"
						userData={jsonData} 
					/>
				</DialogContentText>
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
