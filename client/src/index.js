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

const routes =         
    <Router history={history}>
        <App>
            <UserProvider>
                <Route path="/" component={MenuBar} />
                <Route path="/profile" component={Profile} />
            </UserProvider>
            <Route path="/market" component={Market} />
            <Route path="/" exact component={Home} />
            <Route path="/" component={Footer} />
        </App>
    </Router>

ReactDOM.render(
    routes,
    document.getElementById('root')
);