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

    useEffect(() => {
        const loadPatterns = (data) => {
            if(data && data.patterns){
                var patternList = [];
                data.patterns.forEach(pattern => {
                    pattern.candles[0].date = new Date(new Date(pattern.candles[0].date).toJSON());
                    pattern.candles[1].date = new Date(new Date(pattern.candles[1].date).toJSON());
                    pattern.candles[0].timeframe = pattern.timeframe;
                    pattern.candles[1].timeframe = pattern.timeframe;
                    patternList.push(pattern.candles);
                });
                if(selectedPatternTimeframe === "All" && selectedPatternType === "All"){
                    setDisplayPatterns(patternList);
                } else {
                    setDisplayPatterns(patternList
                        .filter(items => (selectedPatternType !== "All" ? items[1].title === selectedPatternType : items[1].title === items[1].title) )
                        .filter(items => (selectedPatternTimeframe !== "All" ? items[1].timeframe === selectedPatternTimeframe : items[1].timeframe === items[1].timeframe)));
                }
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
            handleRemovePattern, 
           
        }}>
            {children}
        </PatternContext.Provider>
    );
};

export default PatternProvider;