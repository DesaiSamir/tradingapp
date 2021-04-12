import  { useState, useEffect } from "react";
import { Paper } from '@material-ui/core';
import Footer from "./components/footer/Footer";
import { makeStyles } from '@material-ui/core/styles';
import MenuBar from "./components/menus/MenuBar";
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
    col: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    col4: {
        width: '100%',
    },
    col8:{
        width: '100%',
    },
}));

const App = () => {
	const classes = useStyles();
    const [userData, setUserData] = useState({});useEffect(() => {
        http.get("api/profile", setUserData);
    }, []);

	return (
		<Paper className={classes.content}>
			<MenuBar parentStyles={useStyles} userData={userData}/>
			<Home parentStyles={useStyles} userData={userData}/>
			<Footer />
		</Paper>
	);
};
  
export default App;
