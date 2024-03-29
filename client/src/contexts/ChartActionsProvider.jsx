import React, { createContext, useState, useEffect, useContext } from "react";
import helper from "../utils/helper";
import http from "../utils/http";
import { UserContext } from "./UserProvider";
export const ChartActionsContext = createContext();

const ChartActionsProvider = ({ children }) => {
    const { userId, reloadAllData } = useContext(UserContext);
    const [stockQuote, setStockQuote] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [symbol, setSymbol] = useState('SPY');
    const [unit, setUnit] = useState('Minute');
    const [interval, setInterval] = useState(15);
	const [chartText, setChartText] = useState(`${symbol}, ${interval} ${unit}`);
    const [url, setUrl] = useState('');
    const [isPreMarket, setIsPreMarket] = useState(false);
    const [currentWatchlist, setCurrentWatchlist] = useState([]);
    const [lastPrice, setLastPrice] = useState();
    const [currentTimeframe, setCurrentTimeframe] = useState();
    const [isRegularSession, setIsRegularSession] = useState(false);
    
    useEffect(() => {
        const sessionTemplate = isPreMarket ? "SessionTemplate=USEQPreAndPost" : '';
        const url= `/v2/stream/barchart/$symbol/$interval/$unit/$barsBack/$lastDate?${sessionTemplate}`;
        const resolvedUrl = url.replace('$symbol', symbol).replace('$unit', unit).replace('$interval', unit !== 'Minute' ? 1 : interval)
                    .replace('$lastDate', helper.newDate(new Date())).replace('$barsBack', 600);

        setCurrentTimeframe(unit !== 'Minute' ? unit : `${interval}M`);
        setUrl(resolvedUrl);
        setChartText(symbol);

        const loadBarchartData = (data) => {
            const lastBar = data[data.length - 1];
            if(lastBar)
                setLastPrice(lastBar.close);
            // console.log(data)
            setBarChartData(data);
        }

        const loadQuoteData = (data) => {
            if(data){
                setChartText(`${symbol} - ${data.Description}`);
                setStockQuote(data)
            }
        }
        
        if(userId){
            http.getQuoteData(symbol, loadQuoteData);
            const payload = { method: 'STREAM', url: resolvedUrl };
            http.getBarChartData(payload, loadBarchartData, symbol);
            http.getWatchlist(setCurrentWatchlist);
        }
    }, [unit, interval, symbol, isPreMarket, userId, reloadAllData]);
    
    const onUnitClicked = (item) => {
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
        }, 2000);
    }

    const setSymbolText = (symbol) => {
        
		var symbolText = document.getElementById('symbol');
		symbolText.value = symbol;
		setSymbol(symbol);
	}

    const setSymbolTextFromCandle = (candle) => {
        const symbol = candle.symbol;
        const tsRegX = /\d+/g;
        const timeframe = parseInt(candle.timeframe.match(tsRegX));

        if(timeframe){
            setUnit('Minute')
            setInterval(timeframe)
        } else {          
            setUnit(candle.timeframe)
            setInterval(1)
        }
		var symbolText = document.getElementById('symbol');
		symbolText.value = symbol;
		setSymbol(symbol);
	}

	const handleAddWatchlist = (e, setOpen) => {
		if (e.type === 'keydown' && e.key !== 'Enter') return;
		e.preventDefault();
		var stockSymbol = document.getElementById('addStockSymbol');
		
        addFavWatchlist(stockSymbol.value);
        
		setOpen(false);
	}

    const addFavWatchlist = async (symbol) => {
        const payload = { 
			Symbol: symbol.toUpperCase(),
		};
	
		const addedSymbol = await http.send('POST','api/watchlist', payload);
	
		if(addedSymbol){
			const newSymbol = {
				Symbol: addedSymbol.symbol
			};
			setCurrentWatchlist([...currentWatchlist,  newSymbol]);
			http.getWatchlist(setCurrentWatchlist);
		}
    }
	
	const handleDeleteWatchlist = async (symbol) => {
		
		setCurrentWatchlist(currentWatchlist.filter(list => list.Symbol !== symbol));
		
		const payload = { 
			Symbol: symbol,
		};

		http.send('DELETE',`api/watchlist/${symbol}`, payload);
	}

    const handleDayTradeSymbol = async (symbol) => {
		const cwlIndex = currentWatchlist.findIndex(list => list.Symbol === symbol);
        let newCWL = [...currentWatchlist];
        newCWL[cwlIndex] = {...newCWL[cwlIndex], DayTrade: !newCWL[cwlIndex].DayTrade};
		setCurrentWatchlist(newCWL);
		
		const payload = { 
			Symbol: symbol,
		};

		http.send('POST',`api/watchlist/daytrade`, payload);
	}

	const handleChangeRegularSession = (e) => {
		setIsRegularSession(e.target.checked);
        http.overrideRegularSession(e.target.checked);
	}

    return (
        <ChartActionsContext.Provider value={{
            stockQuote,  lastPrice,
            barChartData, 
            symbol, setSymbol,
            unit, 
            interval, 
            chartText, 
            url,
            isPreMarket, setIsPreMarket,
            onUnitClicked, handleChangeRegularSession,
            onTextChanged, setIsRegularSession, isRegularSession,
            setSymbolText, setSymbolTextFromCandle,
            currentWatchlist, currentTimeframe,
            handleAddWatchlist, handleDeleteWatchlist, addFavWatchlist, handleDayTradeSymbol
        }}>
            {children}
        </ChartActionsContext.Provider>
    );
};

export default ChartActionsProvider;