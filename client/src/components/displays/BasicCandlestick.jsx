import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import * as React from "react";
import {
    elderRay, ema, discontinuousTimeScaleProviderBuilder, 
    Chart, ChartCanvas, BarSeries, CandlestickSeries, LineSeries,
    CurrentCoordinate, ElderRaySeries,
    MovingAverageTooltip, OHLCTooltip, SingleValueTooltip, HoverTooltip,
    lastVisibleItemBasedZoomAnchor, XAxis, YAxis, CrossHairCursor,
    EdgeIndicator, MouseCoordinateX, MouseCoordinateY,
    ZoomButtons, withDeviceRatio, withSize, Label, Annotate, LabelAnnotation,
} from "react-financial-charts";

const StockChart = ({ data: initialData, dateTimeFormat = "%d %b", height, ratio, width, symbol, ...rest }) => {
    const margin = { left: 50, right: 50, top: 0, bottom: 24 };
    const pricesDisplayFormat = format(".2f");
    const numberDisplayFormat = format(",");
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

    const elder = elderRay();

    const calculatedData = elder(ema26(ema12(initialData)));

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

    const max = xAccessor(data[data.length - 1]);
    const min = xAccessor(data[Math.max(0, data.length - 100)]);
    const xExtents = [min, max + 5];

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
        return [data.high, data.low];
    };

    const yEdgeIndicator = (data) => {
        return data.close;
    };

    const volumeColor = (data) => {
        return data.close > data.open ? "rgba(38, 166, 154, 0.3)" : "rgba(239, 83, 80, 0.3)";
    };

    const volumeSeries = (data) => {
        return data.volume;
    };

    const openCloseColor = (data) => {
        return data.close > data.open ? "#26a69a" : "#ef5350";
    };

    const candelFillColor = (data) => {
        var fillColor = data.close > data.open ? "#26a69a" : "#ef5350"

        switch (data.pattern) {
            case "Bullish Engulfing":
                fillColor = 'green';
                break;
            case "Berish Engulfing":
                fillColor = 'red';
                break;
            default:
                fillColor = data.close > data.open ? "#26a69a" : "#ef5350";
                break;

        }
        return fillColor;
    }

    const candlestickYAccessor = (data) => {
        return { open: data.open, high: data.high, low: data.low, close: data.close, pattern: data.pattern};
    }
    
    const annotBullish = {
        text: "Bullish",
        tooltip: "Go Long",
        y: ({ yScale, datum }) => yScale(datum.high),
    };
    
    const whenBullish = (data) => {
        return data.pattern === "Bullish Engulfing";
    };
    
    const annotBerish = {
        text: "Berish",
        tooltip: "Go Short",
        y: ({ yScale, datum }) => yScale(datum.low),
    };
    
    const whenBerish = (data) => {
        return data.pattern === "Berish Engulfing";
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
            <Chart id={2} height={barChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
                
                <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>
                
                <MouseCoordinateY at="left" orient="left" displayFormat={format(".4s")} />
                <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries}  />
                <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

            </Chart>
            <Chart id={3} height={chartHeight} yExtents={candleChartExtents}>
                <XAxis showGridLines showTickLabel={false} />
                <YAxis showGridLines tickFormat={pricesDisplayFormat} />
                <CandlestickSeries fill={candelFillColor} yAccessor={candlestickYAccessor} />
                <LineSeries yAccessor={ema26.accessor()} strokeStyle={ema26.stroke()} />
                <CurrentCoordinate yAccessor={ema26.accessor()} fillStyle={ema26.stroke()} />
                <LineSeries yAccessor={ema12.accessor()} strokeStyle={ema12.stroke()} />
                <CurrentCoordinate yAccessor={ema12.accessor()} fillStyle={ema12.stroke()} />
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />
                <EdgeIndicator
                    itemType="last"
                    rectWidth={margin.right}
                    fill={openCloseColor}
                    lineStroke={openCloseColor}
                    displayFormat={pricesDisplayFormat}
                    yAccessor={yEdgeIndicator}
                />
                <MovingAverageTooltip
                    origin={[8, 24]}
                    options={[
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
                    text={symbol}
                    {...rest}
                    x={(width - margin.left - margin.right) / 2}
                    y={(height - margin.top - margin.bottom) / 2}
                />
                <Annotate with={LabelAnnotation} usingProps={annotBullish} when={whenBullish} />
                <Annotate with={LabelAnnotation} usingProps={annotBerish} when={whenBerish} />
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
                <MouseCoordinateY rectWidth={margin.right} displayFormat={pricesDisplayFormat} />

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

export default (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));

// export const Daily = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));

// export const MinutesStockChart = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));

// export const SecondsStockChart = (withSize({ style: { minHeight: 600 } })(withDeviceRatio()(StockChart)));