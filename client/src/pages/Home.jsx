import { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import _ from "lodash";
import DrawerPanel from '../components/navigations/DrawerPanel'
import { UserContext } from "../contexts/UserProvider";
import Login from "./Login";
import ChartActionsProvider from "../contexts/ChartActionsProvider";
import OrderProvider from '../contexts/OrderProvider';
import BalanceProvider from "../contexts/BalanceProvider";
import PatternProvider from "../contexts/PatternProvider";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Home = () => {
    const classes = useStyles();
    const { userId } = useContext(UserContext);

    return (
        <div className={classes.root}>
            {   _.isNull(userId) ?
                    <Login />
                :
                    <BalanceProvider>
                        <ChartActionsProvider>
                            <PatternProvider>
                                <OrderProvider>
                                    <DrawerPanel />
                                </OrderProvider>
                            </PatternProvider>
                        </ChartActionsProvider>
                    </BalanceProvider>
            }
        </div>
    );
};

export default Home;
