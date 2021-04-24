import React, { createContext, useState, useEffect, useContext } from "react";
import helper from "../utils/helper";
import http from "../utils/http";
import UserProvider from "./UserProvider";
const context = createContext(null);

const ChartActionsProvider = ({ children }) => {
    const { userId } = useContext(UserProvider.context);
    const [stockQuote, setStockQuote] = useState();
    const [barChartData, setBarChartData] = useState([]);
    const [symbol, setSymbol] = useState('SPY');
    const [unit, setUnit] = useState('Minute');
    const [interval, setInterval] = useState(15);
	const [chartText, setChartText] = useState(`${symbol}, ${interval} ${unit}`);
    const [url, setUrl] = useState();
    const [isPreMarket, setIsPreMarket] = useState(false);
    
    useEffect(() => {
        const sessionTemplate = isPreMarket ? "&SessionTemplate=USEQPreAndPost" : '';
        const url= `/v2/stream/barchart/$symbol/$interval/$unit?daysBack=$daysBack&lastDate=$lastDate${sessionTemplate}`;
        const resolvedUrl = url.replace('$symbol', symbol).replace('$unit', unit).replace('$interval', unit !== 'Minute' ? 1 : interval)
                    .replace('$lastDate', helper.newDate(new Date())).replace('$daysBack', unit !== 'Minute' ? 1000 : isPreMarket || interval < 15 ? 30 : 300);

        setUrl(resolvedUrl);
        setChartText(`${symbol},${unit === 'Minute' ? interval : ''} ${unit}`);
        
        const payload = {
            method: 'STREAM',
            url: resolvedUrl 
        };
        
        if(userId){
            http.getQuoteData(symbol, setStockQuote);
            http.getBarChartData(payload, setBarChartData);
        }
    }, [unit, interval, symbol, isPreMarket, userId]);
    
    const onUnitClicked = (e, item) => {
        e.preventDefault();
        setInterval(item.interval);
        setUnit(item.unit);
    }

    var timer;
    const onTextChanged = (e, name) => {
        if (e.key === 'Enter') {
            setSymbol(e.target.value);
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            switch (name) {
                case 'symbol':
                    setSymbol(e.target.value);
                    break;
                default:
                    break;
            }
        }, 1000);
    }

    return (
        <context.Provider value={{
            stockQuote, setStockQuote,
            barChartData, 
            symbol, setSymbol,
            unit, setUnit,
            interval, setInterval,
            chartText, 
            url,
            isPreMarket, setIsPreMarket,
            onUnitClicked, 
            onTextChanged,
        }}>
            {children}
        </context.Provider>
    );
};

ChartActionsProvider.context = context;

export default ChartActionsProvider;