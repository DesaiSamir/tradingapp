import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { useState, useContext } from "react";
import {
    elderRay, ema, discontinuousTimeScaleProviderBuilder, 
    Chart, ChartCanvas, BarSeries, CandlestickSeries, LineSeries,
    CurrentCoordinate, ElderRaySeries,
    MovingAverageTooltip, OHLCTooltip, SingleValueTooltip, HoverTooltip,
    lastVisibleItemBasedZoomAnchor, XAxis, YAxis, CrossHairCursor,
    EdgeIndicator, MouseCoordinateX, MouseCoordinateY, PriceCoordinate,
    ZoomButtons, withDeviceRatio, withSize, Label, Annotate, BarAnnotation
} from "react-financial-charts";
import { OrderContext } from "../../contexts/OrderProvider";
// import { ChartActionsContext } from "../../contexts/ChartActionsProvider";

var stockChartHeight = 360;

const StockChart = ({ data: initialData, dateTimeFormat = "%d %b", height, ratio, width, chartText, ...rest }) => {
    const margin = { left: 50, right: 50, top: 0, bottom: 24 };
    const pricesDisplayFormat = format(".2f");
    const numberDisplayFormat = format(",");
    const [lastClose, setLastClose] = useState(0);
    const [lastColor, setLastColor] = useState("#26a69a");

    if(document.getElementById('timeframes').clientHeight)
        stockChartHeight = document.getElementById('timeframes').clientHeight;
    
    const { handleClickOpenTradeDialog, symbolOrders, symbolAvgPrice } = useContext(OrderContext);
    // const { lastPrice } = useContext(ChartActionsContext);

    const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d => d.date),
    );
    const ema12 = ema()
        .id(1)
        .options({ windowSize: 12 })
        .merge((d, c) => {
            d.ema12 = c;
        })
        .accessor((d) => d.ema12);

    const ema26 = ema()
        .id(2)
        .options({ windowSize: 26 })
        .merge((d, c) => {
            d.ema26 = c;
        })
        .accessor((d) => d.ema26);

        const ema200 = ema()
            .id(2)
            .options({ windowSize: 200 })
            .merge((d, c) => {
                d.ema200 = c;
            })
            .accessor((d) => d.ema200);

    const elder = elderRay();

    const calculatedData = elder(ema200(ema26(ema12(initialData))));

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max + 8];
    const gridHeight = height - margin.top - margin.bottom;

    const elderRayHeight = 100;
    const elderRayOrigin = (_, h) => [0, h - elderRayHeight];
    const barChartHeight = gridHeight / 4;
    const barChartOrigin = (_, h) => [0, h - barChartHeight - elderRayHeight];
    const chartHeight = gridHeight - elderRayHeight;

    const timeDisplayFormat = timeFormat(dateTimeFormat);
    const barChartExtents = (data) => {
        return data.volume;
    };

    const candleChartExtents = (data) => {
        return [data.high + 0.1, data.low - 0.1];
    };

    const yEdgeIndicator = (data) => {
        setLastClose(data.close);
        return data.close;
    };

    const volumeColor = (data) => {
        return data.close > data.open ? "rgba(38, 166, 154, 0.3)" : "rgba(239, 83, 80, 0.3)";
    };

    const volumeSeries = (data) => {
        return data.volume;
    };

    const openCloseColor = (data) => {
        const color = data.close > data.open ? "#26a69a" : "#ef5350";
        setLastColor(color);
        return color;
    };

    const candelFillColor = (data) => {
        var fillColor = data.close > data.open ? "#26a69a" : "#ef5350"

        switch (data.pattern) {
            case "isBullishEngulfing":
                fillColor = 'green';
                break;
            case "isBearishEngulfing":
                fillColor = 'red';
                break;
            default:
                break;
        }
        
        return fillColor;
    }

    const candlestickYAccessor = (data) => {
        return { open: data.open, high: data.high, low: data.low, close: data.close, pattern: data.pattern};
    }   

    const onCandleClicked = (e, data) => {
        e.preventDefault();
        handleClickOpenTradeDialog(data.datum);
    }

    const orderDisplay = symbolOrders.map(order => {
        const lmPrice = order.LimitPrice;
        const stPrice = order.StopPrice;
        const displayPrice = lmPrice !== 0 ? lmPrice : stPrice; 
        const displayColor = displayPrice > symbolAvgPrice ? "#26a69a" : "#ef5350";

        return(<PriceCoordinate key={order.OrderID} orient="left" at="right" rectWidth={margin.right} 
            fill={displayColor} lineStroke={displayColor} strokeDasharray="ShortDot"
        displayFormat={pricesDisplayFormat} price={displayPrice} />);

    });

    const annotBullish = {
        tooltip: "Go Long",
        textIcon: '\u25B2',
        textIconFill: 'green',
        textIconFontSize: 20,
        className: 'bullish',
        y: ({ yScale, datum }) => yScale(datum.low- 0.10), // > 1000 ? datum.low - 4 : datum.low > 500 ? datum.low - 1.5 : datum.low > 100 ? datum.low - .35 : datum.low > 10 ? datum.low - .17 : datum.low - .03),
        x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
        onClick: (e, datum) => onCandleClicked(e, datum, xAccessor, xScale) - 0.35,
    };

    const annotBerish = {
        tooltip: "Go Short",
        textIcon: '\u25BC',
        textIconFill: 'red',
        textIconFontSize: 20,
        className: 'bearish',
        y: ({ yScale, datum }) => yScale(datum.high + 0.01),// > 1000 ? datum.high + 4 : datum.high > 500 ? datum.high + 1.5 : datum.high > 100 ? datum.high + .35 : datum.high > 10 ? datum.high + .17 : datum.high + .03),
        x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)) - 0.35,
        onClick: onCandleClicked,
    };
    
    const averageVolume = (data) => {
        const { length } = data;
        return data.reduce((acc, val) => {
           return acc + (val.volume/length);
        }, 0);
    };

    return (
        <ChartCanvas
            height={height}
            ratio={ratio}
            width={width}
            margin={margin}
            data={data}
            displayXAccessor={displayXAccessor}
            seriesName="Data"
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            zoomAnchor={lastVisibleItemBasedZoomAnchor}
        >
            <Chart id={1} height={chartHeight} yExtents={candleChartExtents}>
                {orderDisplay}
                <PriceCoordinate  orient="left" at="right" rectWidth={margin.right} displayFormat={pricesDisplayFormat}  
                    fill={symbolAvgPrice > lastClose ? "#ef5350" : "#26a69a"} lineStroke={symbolAvgPrice > lastClose ? "#ef5350" : "#26a69a"}
                    price={symbolAvgPrice} strokeDasharray="ShortDot" />
            </Chart>
            <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
                
                <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
                
                <LineSeries yAccessor={() => averageVolume(data)} strokeStyle="#9B0A47" />
                <MouseCoordinateY at="left" orient="left" displayFormat={format(".4s")} arrowWidth={10} />
                <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries}  />
                <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />
                <EdgeIndicator orient="right" at="left" rectWidth={margin.right} fill="#9B0A47" 
                        displayFormat={format(".4s")} yAccessor={() => averageVolume(data)} arrowWidth={10} />

            </Chart>
            <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
                <XAxis showGridLines showTickLabel={false} />
                <YAxis showGridLines tickFormat={pricesDisplayFormat} />
                <CandlestickSeries fill={candelFillColor} yAccessor={candlestickYAccessor} />
                <LineSeries yAccessor={ema200.accessor()} strokeStyle={ema200.stroke()} />
                <CurrentCoordinate yAccessor={ema200.accessor()} fillStyle={ema200.stroke()} />
                <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
                <CurrentCoordinate yAccessor={ema26.accessor()} fillStyle={ema26.stroke()} />
                <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
                <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} arrowWidth={10} />
                <LineSeries yAccessor={() => lastClose} strokeStyle={lastColor}  />
                <EdgeIndicator itemType="last" rectWidth={margin.right} fill={openCloseColor} lineStroke={openCloseColor} 
                    displayFormat={pricesDisplayFormat} yAccessor={yEdgeIndicator} arrowWidth={10} strokeDasharray="Solid" />
                <MovingAverageTooltip
                    origin={[8, 24]}
                    options={[
                        {
                            yAccessor: ema200.accessor(),
                            type: "EMA",
                            stroke: ema200.stroke(),
                            windowSize: ema200.options().windowSize,
                        },
                        {
                            yAccessor: ema26.accessor(),
                            type: "EMA",
                            stroke: ema26.stroke(),
                            windowSize: ema26.options().windowSize,
                        },
                        {
                            yAccessor: ema12.accessor(),
                            type: "EMA",
                            stroke: ema12.stroke(),
                            windowSize: ema12.options().windowSize,
                        },
                    ]}
                />

                <ZoomButtons />
                <Label
                    text={chartText}
                    {...rest}
                    x={(width - margin.left - margin.right) / 2}
                    y={(height - margin.top - margin.bottom) / 2}
                />
                <Annotate with={BarAnnotation} usingProps={annotBullish} when={(data) => data.isBullishEngulfing} />
                <Annotate with={BarAnnotation} usingProps={annotBerish} when={(data) => data.isBearishEngulfing} />
                <OHLCTooltip origin={[8, 16]} textFill={(d) => (d.close > d.open ? "#26a69a" : "#ef5350")} />
                <HoverTooltip
                    yAccessor={ema12.accessor()}
                    tooltip={{
                        content: ({ currentItem, xAccessor }) => ({
                            x: timeDisplayFormat(xAccessor(currentItem)),
                            y: [
                                {
                                    label: "Open",
                                    value: currentItem.open && pricesDisplayFormat(currentItem.open),
                                },
                                {
                                    label: "High",
                                    value: currentItem.high && pricesDisplayFormat(currentItem.high),
                                },
                                {
                                    label: "Low",
                                    value: currentItem.low && pricesDisplayFormat(currentItem.low),
                                },
                                {
                                    label: "Close",
                                    value: currentItem.close && pricesDisplayFormat(currentItem.close),
                                },
                                {
                                    label: "Diff",
                                    value: pricesDisplayFormat(currentItem.high - currentItem.low),
                                },
                                {
                                    label: "Volume",
                                    value: currentItem.volume && numberDisplayFormat(currentItem.volume),
                                },
                            ],
                        }),
                    }}
                />
            </Chart>
            <Chart
                id={4}
                height={elderRayHeight}
                yExtents={[0, elder.accessor()]}
                origin={elderRayOrigin}
                padding={{ top: 8, bottom: 8 }}
            >
                <XAxis showGridLines gridLinesStrokeStyle="#e0e3eb" />
                <YAxis ticks={4} tickFormat={pricesDisplayFormat} />

                <MouseCoordinateX displayFormat={timeDisplayFormat} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} arrowWidth={10} />

                <ElderRaySeries yAccessor={elder.accessor()} />

                <SingleValueTooltip
                    yAccessor={elder.accessor()}
                    yLabel="Elder Ray"
                    yDisplayFormat={(d) =>
                        `${pricesDisplayFormat(d.bullPower)}, ${pricesDisplayFormat(d.bearPower)}`
                    }
                    origin={[8, 16]}
                />
            </Chart>
            <CrossHairCursor />
        </ChartCanvas>
    );
    
}

StockChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
    dateTimeFormat: PropTypes.string,
    height: PropTypes.number,
	// type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

export default (withSize({ style: { height: window.innerHeight - 122 - stockChartHeight, padding: 0 } })(withDeviceRatio()(StockChart)));

// export const Daily = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));

// export const MinutesStockChart = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));

// export const SecondsStockChart = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));