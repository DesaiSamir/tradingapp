import { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import _ from "lodash";
import DrawerPanel from '../components/navigations/DrawerPanel'
import UserProvider from "../contexts/UserProvider";
import Login from "./Login";
import ChartActionsProvider from "../contexts/ChartActionsProvider";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Home = () => {
    const classes = useStyles();
    const { userId } = useContext(UserProvider.context);

    return (
        <div className={classes.root}>
            {   _.isNull(userId) ?
                    <Login />
                :
                    <ChartActionsProvider>
                        <DrawerPanel />
                    </ChartActionsProvider>
            }
        </div>
    );
};

export default Home;
