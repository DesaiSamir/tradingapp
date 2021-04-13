import { useState, useEffect } from "react";
import VerticalTabPanel from '../components/navigations/VerticalTabPanel'
const http = require("../utils/http");
const helper = require("../utils/helper");

const Home = ({parentStyles, userData}) => {
    const parentClasses = parentStyles();
    const [stockQuote, setStockQuote] = useState();
    const [barChartData, setBarChartData] = useState({});
    const [symbol, setSymbol] = useState('SPY');
    const [method, setMethod] = useState('GET');
    const [unit, setUnit] = useState('Minute');
    const [interval, setInterval] = useState(15);
	const [chartText, setChartText] = useState(`${symbol}, ${interval} ${unit}`);
    const [startDate, setStartDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [endDate, setEndDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [lastDate, setLastDate] = useState(helper.formatDate(new Date().toUTCString()));
    const [barsBack, setBarsBack] = useState(100);
    const [daysBack, setDaysBack] = useState(30);
    const [url, setUrl] = useState(`/v2/data/quote/${symbol}`);
    const apis = [
        {
            id: 1,
            method: 'GET',
            title: 'Get Quote',
            value: `/v2/data/quote/${symbol}`,
            url: `/v2/data/quote/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 2,
            method: 'STREAM',
            title: 'Stream Quote Changes',
            value: `/v2/stream/quote/changes/${symbol}`,
            url: `/v2/stream/quote/changes/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 3,
            method: 'STREAM',
            title: 'Stream Quote Snapshots',
            value: `/v2/stream/quote/snapshots/${symbol}`,
            url: `/v2/stream/quote/snapshots/$symbol`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 4,
            method: 'STREAM',
            title: 'Stream BarChart - Starting on Date',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${startDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$startDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 5,
            method: 'STREAM',
            title: 'Stream BarChart - Date Range',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${startDate}/${endDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$startDate/$endDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: true,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
        {
            id: 6,
            method: 'STREAM',
            title: 'Stream BarChart - Bars Back',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}/${barsBack}/${startDate}/${lastDate}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit/$barsBack/$startDate/$lastDate?SessionTemplate=USEQPreAndPost`,
            isUnit: true,
            isInteral: true,
            isStartDate: true,
            isEndDate: false,
            isLastDate: true,
            isDaysBack: false,
            isBarsBack: true
        },
        {
            id: 7,
            method: 'CHUNK',
            title: 'Stream BarChart - Days Back',
            value: `/v2/stream/barchart/${symbol}/${interval}/${unit}?daysBack=${daysBack}&lastDate=${lastDate}`,
            url: `/v2/stream/barchart/$symbol/$interval/$unit?daysBack=$daysBack&lastDate=$lastDate`,
            isUnit: true,
            isInteral: true,
            isStartDate: false,
            isEndDate: false,
            isLastDate: true,
            isDaysBack: true,
            isBarsBack: false
        },
        {
            id: 8,
            method: 'STREAM',
            title: 'Stream Tick Bars',
            value: `/v2/stream/tickbars/${symbol}/${interval}/${barsBack}?SessionTemplate=USEQPreAndPost`,
            url: `/v2/stream/tickbars/$symbol/$interval/$barsBack?SessionTemplate=USEQPreAndPost`,
            isUnit: false,
            isInteral: true,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: true
        },
        {
            id: 9,
            method: 'GET',
            title: 'Get Symbol List',
            value: `/v2/data/symbollists`,
            url: `/v2/data/symbollists`,
            isUnit: false,
            isInteral: false,
            isStartDate: false,
            isEndDate: false,
            isLastDate: false,
            isDaysBack: false,
            isBarsBack: false
        },
    ];
    const [api, setApi] = useState(apis[6]);
    
    useEffect(() => {
        const resolvedUrl = api.url.replace('$symbol', symbol).replace('$unit', unit).replace('$interval', unit !== 'Minute' ? 1 : interval)
                    .replace('$lastDate', helper.newDate(lastDate)).replace('$daysBack', unit !== 'Minute' ? 100 : daysBack);

        setUrl(resolvedUrl);
        setMethod(api.method);
        setChartText(`${symbol.toUpperCase()}, ${interval} ${unit}`);
        
        // console.log(api);
        const payload = {
            method: api.method,
            url: resolvedUrl 
        };

        ////AlphaAdvantage APIs
        // setMarketDataStream(loading);
        // http.getintraday(symbol, setMarketDataStream);
        // http.getdaily(symbol, setMarketDataStream);

        ////Tradestation APIs
        
        http.send({ method: 'GET', url: `/v2/data/quote/${symbol}`}, setStockQuote);
        
        if(url.indexOf('barchart') > 0){            
            http.send(payload, setBarChartData);
        };
    }, [url, api, method, unit, interval, lastDate, daysBack, symbol]);
    
    const onSelectChange = (e, name, menuItems) => {
        const id = e.target.value;  
        menuItems.forEach((item) => {
            if(item.id === id){
                switch (name) {
                    case 'api':
                        setApi(item);
                        break;

                    case 'interval':
                        setInterval(item.value);
                        break;
                
                    case 'unit':
                        setUnit(item.value);
                        var intervalSelect = document.getElementById('interval');
                        intervalSelect.innerHTML = (item.value !== 'Minute') ? 1: interval;
                        var daysBackText = document.getElementById('daysBack');
                        daysBackText.value = (item.value !== 'Minute') ? 100: daysBack;
                        break;
                
                    default:
                        break;
                }
            }
        } )
    }

    const onDateChange = (e, name) => {
        var date = new Date(e.target.value);
        
        switch (name) {
            case 'startDate':
                setStartDate(date);
                break;

            case 'endDate':
                setEndDate(date);
                break;

            case 'lastDate':
                setLastDate(date);
                break;
            default:
                break;
        }
    }

    var timer;
    const onTextChanged = (e, name) => {
        if (e.key === 'Enter') {
            setUrl(api.url.replace('$symbol', symbol).replace('$unit', unit).replace('$interval', unit !== 'Minute' ? 1 : interval)
                .replace('$lastDate', helper.newDate(lastDate)).replace('$daysBack', unit !== 'Minute' ? 100 : daysBack))
            return;
        }

        clearTimeout(timer);

        timer = setTimeout(() => {
            switch (name) {
                case 'daysBack':
                    setDaysBack(e.target.value);
                    break;
                case 'barsBack':
                    setBarsBack(e.target.value);
                    break;
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
            <VerticalTabPanel 
                url={url}
                parentStyles={parentStyles} 
                userData={userData} 
                stockQuote={stockQuote} 
                barChartData={barChartData} 
                symbol={symbol} 
                setSymbol={setSymbol}
                chartText={chartText}
                onTextChanged={onTextChanged} 
                onSelectChange={onSelectChange}
                onDateChange={onDateChange} 
            />
        </div>
    );
};

export default Home;
