import React, { createContext, useState, useEffect } from "react";
export const PatternContext = createContext(null);
const http = require("../utils/http");

const PatternProvider = ({ children }) => {
	const [selectedPatternType, setSelectedPatternType] = useState("All");
	const [selectedPatternTimeframe, setSelectedPatternTimeframe] = useState("All");
	const [displayPatterns, setDisplayPatterns] = useState([]);
    const [currentPatterns, setCurrentPatterns] = useState([]);
    const [timeframes, setTimeframes] = useState([]);
    const [patternTypes, setPatternTypes] = useState([]);
	const [lastSelectedTab, setLastSelectedTab] = useState(0);
    const [symbolHasOrder, setSymbolHasOrder] = useState([]);
    const [symbolHasPosition, setSymbolHasPosition] = useState([]);

    useEffect(() => {
        const loadPatterns = (data) => {
            if(data && data.patterns){
                var patternList = [];
                data.patterns.forEach(pattern => {
                    pattern.candles[0].date = new Date(new Date(pattern.candles[0].date).toJSON());
                    pattern.candles[1].date = new Date(new Date(pattern.candles[1].date).toJSON());
                    pattern.candles[0].timeframe = pattern.timeframe;
                    pattern.candles[1].timeframe = pattern.timeframe;
                    patternList.push(pattern);
                });
                if(selectedPatternTimeframe === "All" && selectedPatternType === "All"){
                    setDisplayPatterns(patternList);
                } else {
                    setDisplayPatterns(patternList
                        .filter(items => (selectedPatternType !== "All" ? items[1].pattern_name === selectedPatternType : items[1].pattern_name === items[1].pattern_name) )
                        .filter(items => (selectedPatternTimeframe !== "All" ? items[1].timeframe === selectedPatternTimeframe : items[1].timeframe === items[1].timeframe)));
                }
                const orderSymbolList = patternList.filter(p => p.has_active_order === 1 && p.symbol);
                const orderSymbols = Array.prototype.map.call(orderSymbolList, s => s.symbol );
                setSymbolHasOrder(orderSymbols);
                const positionSymbolList = patternList.filter(p => p.has_active_position === 1 && p.symbol);
                const positionSymbols = Array.prototype.map.call(positionSymbolList, s => s.symbol );
                setSymbolHasPosition(positionSymbols);
                setCurrentPatterns(data);
            }
        };

        if(currentPatterns.length === 0){
            http.getPatterns(loadPatterns);
        }
        
        if(timeframes.length === 0) {
            http.getPatternTimeframes(setTimeframes);
        }
        if(patternTypes.length === 0){
            http.getPatternTypes(setPatternTypes);
        }
        
        loadPatterns(currentPatterns);
    }, [selectedPatternType, selectedPatternTimeframe, timeframes, patternTypes]);

    const handleRemovePattern = async (pattern) => {
        console.log(pattern, displayPatterns);
        const symbol = pattern.symbol;
        setDisplayPatterns(displayPatterns.filter(list => list[0].symbol !== symbol));
		
		const payload = { 
			Symbol: symbol,
		};

		http.send('DELETE',`api/pattern/${symbol}`, payload);
    }

    return (
        <PatternContext.Provider value={{
            selectedPatternTimeframe, setSelectedPatternTimeframe, selectedPatternType, setSelectedPatternType,
            currentPatterns, patternTypes, timeframes, displayPatterns, lastSelectedTab, setLastSelectedTab,
            handleRemovePattern, symbolHasOrder, symbolHasPosition, 
           
        }}>
            {children}
        </PatternContext.Provider>
    );
};

export default PatternProvider;