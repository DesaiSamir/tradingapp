import React from 'react';
import { Paper } from '@material-ui/core';
import Footer from "./components/footer/Footer";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	content: {
		WebkitOverflowScrolling: 'touch',
		height: window.innerHeight - 50,	  
		flex: '1 0 auto',
    }
}));

const App = ({children}) => {
	const classes =useStyles();
	return (
		<div>
			<Paper className={classes.content}>
				{children}
			</Paper>
			<Footer />
		</div>
	);
};
  
export default App;
