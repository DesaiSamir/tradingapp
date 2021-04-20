import { useState, useEffect } from "react";
import DrawerPanel from '../components/navigations/DrawerPanel'
const http = require("../utils/http");
const helper = require("../utils/helper");

const Home = ({parentStyles, userData}) => {
    const parentClasses = parentStyles();
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
        // setBarChartData([]);
        ////AlphaAdvantage APIs
        // setMarketDataStream(loading);
        // http.getintraday(symbol, setMarketDataStream);
        // http.getdaily(symbol, setMarketDataStream);

        ////Tradestation APIs
        // if(userData){
        http.getQuoteData({ method: 'GET', url: `/v2/data/quote/${symbol}`}, setStockQuote);
        
        http.getBarChartData(payload, setBarChartData);
            // if(url && url.indexOf('barchart') > 0){
        http.getBarChartDataRecursive(payload, setBarChartData);
            // };
        // }
    }, [unit, interval, symbol, isPreMarket]);
    
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
        <div className={parentClasses.page}>
            <DrawerPanel 
                url={url}
                parentStyles={parentStyles} 
                userData={userData} 
                stockQuote={stockQuote} 
                barChartData={barChartData} 
                symbol={symbol} 
                setSymbol={setSymbol}
                chartText={chartText}
                onTextChanged={onTextChanged} 
                onUnitClicked={onUnitClicked}
                setIsPreMarket={setIsPreMarket} 
            />
        </div>
    );
};

export default Home;
