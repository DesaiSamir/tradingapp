import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StockChart from "../components/displays/BasicCandlestick";
import TimeFrames from "../components/menus/TimeFrames";
import { 
    Grid, 
} from "@material-ui/core";
import PatternsPanel from "../components/navigations/PatternsPanel";
import { ChartActionsContext } from '../contexts/ChartActionsProvider';
import loading from '../res/loading.gif';
import OrdersPanel from '../components/navigations/OrdersPanel';

const Market = () => {
    const classes = useStyles();
	const { 
		url, barChartData, chartText
	} = useContext(ChartActionsContext);
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";

    return (
        <div className={classes.root} >
            <Grid container>
                <Grid item xs={4}>
                    <PatternsPanel /> 
                </Grid>
                <Grid item xs={8}>
                    <Grid container >
                        <Grid item xs={12} id="timeframes" className={classes.head}>
                            <TimeFrames />
                        </Grid>
                        <Grid item xs={12} container>
                            <Grid item xs={12}>
                                {
                                    (barChartData && barChartData.length > 0) ? 
                                        <StockChart 
                                            width="100%"
                                            dateTimeFormat={dateTimeFormat}
                                            data={barChartData}
                                            chartText={chartText} 
                                        />
                                    :   <div className={classes.loading}>
                                            <img src={loading} alt="Loading" />
                                        </div>
                                }
                            </Grid>
                            <Grid item xs={12} className={classes.ordersPanel}>
                                <OrdersPanel />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
export default Market

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "5px",
    },
	spacer: {
        marginTop: "5px",
	},
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    loading:{
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ordersPanel: {
        height: 320,
    }
}));

