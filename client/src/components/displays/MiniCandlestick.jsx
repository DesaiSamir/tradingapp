import { makeStyles } from '@material-ui/core/styles';
import { Chart, ChartCanvas } from "@react-financial-charts/core";
import { discontinuousTimeScaleProviderBuilder } from "@react-financial-charts/scales";
import { CandlestickSeries } from "@react-financial-charts/series";
import { withDeviceRatio, withSize } from "@react-financial-charts/utils";

const useStyles = makeStyles((theme) => ({
    miniChart: {
        marginLeft: '-10px',
    },
}));

const MiniCandlestick = ({data: initialData, height, ratio, width})=> {
    const classes = useStyles();
    const margin = { left: 0, right: 35, top: 10, bottom: 10 };
    const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d) => d.date,
    );

    const { data, xScale, xAccessor } = xScaleProvider(initialData);

    const yExtents = (data) => {
        return [data.high, data.low];
    };

    return (
        <ChartCanvas
            className={classes.miniChart}
            height={height}
            ratio={ratio}
            width={width}
            margin={margin}
            data={data}
            seriesName="Data"
            xScale={xScale}
            xAccessor={xAccessor}
        >
            <Chart id={1} yExtents={yExtents}>
                <CandlestickSeries />
            </Chart>
        </ChartCanvas>
    );
}

export default (withSize({ style: { minHeight: 60 } })(withDeviceRatio()(MiniCandlestick)));
