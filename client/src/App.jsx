import  { useState, useEffect } from "react";
import { Paper } from '@material-ui/core';
import Footer from "./components/footer/Footer";
import { makeStyles } from '@material-ui/core/styles';
import Home from "./pages/Home";
const http = require("./utils/http");

const useStyles = makeStyles((theme) => ({
	content: {
		WebkitOverflowScrolling: 'touch',
		height: window.innerHeight - 50,
    },
	page: {
        height: '-webkit-fill-available',
		margin: '0 auto'
	},
	pageTitle: {
		fontWeight: 400,
		fontSize: '30px',
	},
	
}));

const App = () => {
	const classes = useStyles();
    const [userData, setUserData] = useState(null);useEffect(() => {
        http.getProfileData(setUserData);
    }, []);

	return (
		<Paper className={classes.content}>
			<Home parentStyles={useStyles} userData={userData}/>
			<Footer />
		</Paper>
	);
};
  
export default App;
