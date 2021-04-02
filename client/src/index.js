import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./style/index.css";
import { Router, Route } from "react-router-dom";
import history from "./history";
import UserProvider from "./contexts/UserProvider";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MenuBar from "./components/menus/MenuBar";
import Footer from "./components/footer/Footer";
import Market from "./pages/Market";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	page: {
		width: '80%',
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

const routes =         
    <Router history={history}>
        <App parentStyles={useStyles}>
            <UserProvider>
                <Route path="/" component={() => <MenuBar parentStyles={useStyles} />} />
                <Route path="/profile" component={() => <Profile parentStyles={useStyles} />} />
            </UserProvider>
            <Route path="/market" component={() => <Market parentStyles={useStyles} />} />
            <Route path="/" exact component={() => <Home parentStyles={useStyles} />} />
            <Route path="/" component={() => <Footer parentStyles={useStyles} />} />
        </App>
    </Router>

ReactDOM.render(
    routes,
    document.getElementById('root')
);