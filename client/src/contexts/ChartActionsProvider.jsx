import React, { createContext, useState, useEffect, useContext } from "react";
import helper from "../utils/helper";
import http from "../utils/http";
import { UserContext } from "./UserProvider";
export const ChartActionsContext = createContext();

const ChartActionsProvider = ({ children }) => {
    const { userId } = useContext(UserContext);
    const [stockQuote, setStockQuote] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [symbol, setSymbol] = useState('SPY');
    const [unit, setUnit] = useState('Minute');
    const [interval, setInterval] = useState(15);
	const [chartText, setChartText] = useState(`${symbol}, ${interval} ${unit}`);
    const [url, setUrl] = useState('');
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
        var target = e.target.value;
        
        if(target === '')
            target = 'SPY';


        if (e.key === 'Enter') {
            setSymbol(target);
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            switch (name) {
                case 'symbol':
                    setSymbol(target);
                    break;
                default:
                    break;
            }
        }, 1000);
    }

    return (
        <ChartActionsContext.Provider value={{
            stockQuote, 
            barChartData, 
            symbol, setSymbol,
            unit, 
            interval, 
            chartText, 
            url,
            isPreMarket, setIsPreMarket,
            onUnitClicked, 
            onTextChanged,
        }}>
            {children}
        </ChartActionsContext.Provider>
    );
};

export default ChartActionsProvider;