import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserProvider";
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
	const [lastTimeframe, setLastTimeframe] = useState(1);
	const [lastPatternType, setLastPatternType] = useState(0);
    const { reloadAllData } = useContext(UserContext);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        const loadPatterns = (data) => {
            if(data){
                var patternList = [];
                data.forEach(pattern => {
                    pattern.candles[0].date = new Date(new Date(pattern.candles[0].date).toJSON());
                    pattern.candles[1].date = new Date(new Date(pattern.candles[1].date).toJSON());
                    pattern.candles[0].timeframe = pattern.timeframe;
                    pattern.candles[1].timeframe = pattern.timeframe;
                    patternList.push(pattern);
                });
                const timeframeList = timeframes && Array.prototype.map.call(timeframes, t => t.title);
                const patternTypeList = patternTypes && Array.prototype.map.call(patternTypes, p => p.title);
                
                if(selectedPatternTimeframe === "All" && selectedPatternType === "All"){
                    setDisplayPatterns(patternList);
                } else {
                    setDisplayPatterns(patternList
                        .filter(items => (selectedPatternType !== "All" ? items.pattern_name === selectedPatternType : patternTypeList.includes(items.pattern_name)))
                        .filter(items => (selectedPatternTimeframe !== "All" ? items.timeframe === selectedPatternTimeframe : timeframeList.includes(items.timeframe))));
                }
                const patternType = patternTypes && patternTypes.find(p => p.title === selectedPatternTimeframe);
                if(patternType){
                    setLastPatternType(patternType.id)
                }
                setCurrentPatterns(data);
            }
        };
        
        if(currentPatterns.length === 0 || reloadData !== reloadAllData){
            http.getPatterns(loadPatterns);
            setReloadData(reloadAllData);
        }
        
        if(timeframes.length === 0) {
            http.getPatternTimeframes(setTimeframes);
        }
        if(patternTypes.length === 0){
            http.getPatternTypes(setPatternTypes);
        }
        
        loadPatterns(currentPatterns);
    }, [selectedPatternType, selectedPatternTimeframe, timeframes, patternTypes, reloadAllData, reloadData]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRemovePattern = async (pattern) => {
        console.log(pattern, displayPatterns);
        const symbol = pattern.symbol;
        setDisplayPatterns(displayPatterns.filter(list => list.symbol !== symbol));
        setCurrentPatterns(currentPatterns.filter(list => list.symbol !== symbol));
		
		const payload = { 
			symbol: symbol,
		};

		http.send('DELETE',`api/pattern/${symbol}`, payload);
    }
	
	const onSelectChange = (e, name, items) => {
		const id = e.target.value;
		const item = items.filter(item => item.id === id)[0];
		
		switch (name) {
			case 'types':
				setSelectedPatternType(item.title);
				setLastPatternType(id);
				break;
			
			case 'timeframes':
				setSelectedPatternTimeframe(item.title)
				setLastTimeframe(id);
				break;
				
			default:
				break;
		}
	}

    return (
        <PatternContext.Provider value={{
            selectedPatternTimeframe, selectedPatternType, onSelectChange, lastTimeframe, lastPatternType, 
            currentPatterns, patternTypes, timeframes, displayPatterns, lastSelectedTab, setLastSelectedTab,
            handleRemovePattern,
           
        }}>
            {children}
        </PatternContext.Provider>
    );
};

export default PatternProvider;