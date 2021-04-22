import { makeStyles } from '@material-ui/core/styles';
import StockChart from "../components/displays/BasicCandlestick";
import TimeFrames from "../components/menus/TimeFrames";
import { 
    Grid, 
} from "@material-ui/core";
import PatternsPanel from "../components/navigations/PatternsPanel";

const Market = ({userData, url, barChartData = [], chartText, setSymbol, symbol, onUnitClicked, setIsPreMarket, onTextChanged}) => {
    const classes = useStyles();
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";

    return (
        <div className={classes.root} >
            <Grid container>
                <Grid item xs={4}>
                    <PatternsPanel 
                        userData={userData}
                        symbol={symbol}
                        setSymbol={setSymbol}
                        barChartData={barChartData}
                        chartText={chartText}
                    /> 
                </Grid>
                <Grid item xs={8}>
                    <Grid container >
                        <Grid item xs={12} id="timeframes" className={classes.head}>
                            <TimeFrames 
                                onUnitClicked={onUnitClicked}
                                setIsPreMarket={setIsPreMarket}
                                onTextChanged={onTextChanged}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                (barChartData && barChartData.length > 0) ? 
                                    <StockChart dateTimeFormat={dateTimeFormat} data={barChartData} chartText={chartText} width="100%" />
                                : <div>Loading...</div>
                            }
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
}));

