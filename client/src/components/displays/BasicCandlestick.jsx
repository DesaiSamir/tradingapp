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
import { getPercentDiff } from "../../utils/helper";

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
    // const { stockQuote } = useContext(ChartActionsContext);

    const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d => d.date),
    );
    const ema12 = ema()
        .id(1)
        .options({ windowSize: 21 })
        .merge((d, c) => {
            d.ema12 = c;
        })
        .accessor((d) => d.ema12);

    const ema26 = ema()
        .id(2)
        .options({ windowSize: 51 })
        .merge((d, c) => {
            d.ema26 = c;
        })
        .accessor((d) => d.ema26);

    const ema200 = ema()
        .id(3)
        .options({ windowSize: 200 })
        .merge((d, c) => {
            d.ema200 = c;
        })
        .accessor((d) => d.ema200)
        .stroke('green');

    const sma200 = ema()
        .id(4)
        .options({ windowSize: 200 })
        .accessor((d) => d.sma200)
        .stroke('#9B0A47');

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
    var dataLow = 0;
    var dataHigh = 0;
    const candleChartExtents = (data) => {
        dataLow = dataLow === 0 ? data.low : data.low < dataLow ? data.low : dataLow;
        dataHigh = dataHigh === 0 ? data.high : data.high > dataHigh ? data.high : dataHigh;
        const percentDiff =  getPercentDiff(dataHigh, dataLow) / 1000;
        const high = data.high + (dataHigh * percentDiff);
        const low = data.low - (data.low * percentDiff);
        
        return [high, low];
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

    const candelFillColor = (data, seriesData = []) => {
        const previous = seriesData[data.idx.index - 1];
        var fillColor = data.close > data.open ? "#ffffff00" : previous && (data.close >= previous.close) ? "#26a69a" : "#ef5350";
        
        switch (data.patternType) {
            case "bullish":
                fillColor = 'green';
                break;
            case "bearish":
                fillColor = 'red';
                break;
            default:
                break;
        }
        
        return fillColor;
    }

    const candelStrokeColor = (data, seriesData = []) => {
        const previous = seriesData[data.idx.index - 1];
        const dataMax = Math.max(data.open, data.close);
        const prevMax = previous && Math.max(previous.open, previous.close);
        const prevMin = previous && Math.min(previous.open, previous.close);
        var strokeColor = data.close > data.open 
            ?   previous && (data.open < previous.close && data.close >= previous.open) 
                ?   previous && (dataMax < prevMax || dataMax < prevMin) 
                    ? "red"
                    : "green"
                :   previous && (dataMax < prevMin) 
                    ? "red"
                    : "green"  
            :   previous && (data.close >= previous.close) 
                ? "green" 
                : "red";
        
        return strokeColor;
    }

    const candlestickYAccessor = (data) => {
        return data;
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
        tooltip: (data) => data.pattern,
        textIcon: '\u25B2',
        textIconFill: 'green',
        textIconFontSize: 20,
        className: 'bullish',
        y: ({ yScale, datum }) => yScale(datum.high ),
        x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
        onClick: (e, datum) => onCandleClicked(e, datum, xAccessor, xScale) - 0.35,
    };

    const annotBerish = {
        tooltip: (data) => data.pattern,
        textIcon: '\u25BC',
        textIconFill: 'red',
        textIconFontSize: 20,
        className: 'bearish',
        y: ({ yScale, datum }) => yScale(datum.high),
        x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)) - 0.35,
        onClick: onCandleClicked,
    };
    
    const averageVolume = (data) => {
        const { length } = data;
        return data.reduce((acc, val) => {
           return acc + (val.volume/length);
        }, 0);
    };

    const whenBullish = (data) => {
        var isBullish = false;
        if(data.patternType === 'bullish'){
            isBullish = true;
        }
        return isBullish;
    }

    const whenBearish = (data) => {
        var isBerish = false;
        if(data.patternType === 'bearish'){
            isBerish = true;
        }
        return isBerish;
    }

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
                <CandlestickSeries 
                    fill={(d) => candelFillColor(d, data)} 
                    stroke={(d) => candelStrokeColor(d, data)} 
                    widthRatio={.6} 
                    candleStrokeWidth={1} 
                    wickStroke={(d) => candelStrokeColor(d, data)}
                    yAccessor={candlestickYAccessor} />
                <LineSeries yAccessor={ema200.accessor()} strokeStyle={ema200.stroke()} />
                <CurrentCoordinate yAccessor={ema200.accessor()} fillStyle={ema200.stroke()} />
                <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
                <CurrentCoordinate yAccessor={ema26.accessor()} fillStyle={ema26.stroke()} />
                <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
                <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} arrowWidth={10} />
                <LineSeries yAccessor={() => lastClose} strokeStyle={lastColor}  />
                <CurrentCoordinate yAccessor={sma200.accessor()} fillStyle={ema12.stroke()} />
                <LineSeries yAccessor={sma200.accessor()} strokeStyle="#9B0A47" />
                <EdgeIndicator itemType="last" rectWidth={margin.right} fill={openCloseColor} lineStroke={openCloseColor} 
                    displayFormat={pricesDisplayFormat} yAccessor={yEdgeIndicator} arrowWidth={10} strokeDasharray="Solid" />
                <MovingAverageTooltip
                    origin={[8, 24]}
                    options={[
                        {
                            yAccessor: sma200.accessor(),
                            type: "SMA",
                            stroke: sma200.stroke(),
                            windowSize: sma200.options().windowSize,
                        },
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
                <Annotate with={BarAnnotation} usingProps={annotBullish} when={whenBullish} />
                <Annotate with={BarAnnotation} usingProps={annotBerish} when={whenBearish} />
                <OHLCTooltip origin={[8, 16]} textFill={(d) => (d.close > d.open ? "#26a69a" : "#ef5350")} />
                <HoverTooltip
                    yAccessor={ema200.accessor()}
                    tooltip={{
                        content: ({ currentItem, xAccessor}) => ({
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
                                    label: "Volume",
                                    value: currentItem.volume && numberDisplayFormat(currentItem.volume),
                                },
                                {
                                    label: "Bar Diff",
                                    value: pricesDisplayFormat(currentItem.high - currentItem.low),
                                },
                                {
                                    label: "Bar %",
                                    value: `${pricesDisplayFormat(((currentItem.high - currentItem.low) * 100) / lastClose)}%`,
                                },
                                {
                                    label: "H200 %",
                                    value: `${currentItem.ema200 && pricesDisplayFormat(getPercentDiff(currentItem.high, currentItem.ema200))}%`,
                                },
                                {
                                    label: "L200 %",
                                    value: `${currentItem.ema200 && pricesDisplayFormat(getPercentDiff(currentItem.low, currentItem.ema200))}%`,
                                },
                                {
                                    label: "ATBR",
                                    value: currentItem.atbr && pricesDisplayFormat(currentItem.atbr),
                                },
                                {
                                    label: "ATCR",
                                    value: currentItem.atcr && pricesDisplayFormat(currentItem.atcr),
                                },
                                {
                                    label: "MXBR",
                                    value: currentItem.mxbr && pricesDisplayFormat(currentItem.mxbr),
                                },
                                {
                                    label: "MXCR",
                                    value: currentItem.mxcr && pricesDisplayFormat(currentItem.mxcr),
                                },
                                {
                                    label: "1R Tgt",
                                    value: currentItem.open < currentItem.close 
                                        ? pricesDisplayFormat(currentItem.high + (currentItem.high - currentItem.low))
                                        : pricesDisplayFormat(currentItem.low - (currentItem.high - currentItem.low)),
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