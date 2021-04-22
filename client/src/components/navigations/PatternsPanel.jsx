import React, { useState, useEffect } from "react";
import _ from "lodash";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { 
	Paper, AppBar, Tabs, Tab, Box, Grid, Typography 
} from '@material-ui/core';
import OrderDialog from '../formcontrols/OrderDialog';
import FormDialog from '../formcontrols/FormDialog';
import WatchlistGrid from '../cards/WatchlistGrid';
import TerminalDialog from '../displays/TerminalDialog';
import http from '../../utils/http';
import helper from '../../utils/helper';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Paper>{children}</Paper>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function PatternsPanel({userData, barChartData, symbol, setSymbol, chartText}) {
	const classes = useStyles();
    const [orderResponseData, setOrderResponseData] = useState({});
	const [showResponse, setShowResponse] = useState(false);
    const [currentWatchlist, setCurrentWatchlist] = useState([]);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    var patternCandles = helper.getPatternCandleList(_.clone(barChartData), symbol);
    
    useEffect(() => {
        
        if(isUserLoggedIn){
            http.getWatchlistRecursive(setCurrentWatchlist);
        }
    }, [isUserLoggedIn]);

    if(userData && !isUserLoggedIn){
        setIsUserLoggedIn(true);
    }

    if(currentWatchlist.length === 0 && isUserLoggedIn){
        http.getWatchlist(setCurrentWatchlist);
    }
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleAddWatchlist = async (e, setOpen) => {
		if (e.type === 'keydown' && e.key !== 'Enter') return;
		e.preventDefault();
		var stockSymbol = document.getElementById('addStockSymbol');
		http.clearQuoteInterval();
		const payload = { 
			Symbol: stockSymbol.value,
		};
	
		const addedSymbol = await http.send('POST','api/watchlist', payload);
	
		if(addedSymbol){
			console.log(addedSymbol);
			const newSymbol = {
				Symbol: addedSymbol.symbol
			};
			setCurrentWatchlist([...currentWatchlist,  newSymbol]);
		}
		setOpen(false);
	}
	
	const handleDeleteWatchlist = async (e, stock) => {
		e.preventDefault();
		// console.log(stock.Symbol)
		const payload = { 
			Symbol: stock.Symbol,
		};
		const deleteSymbol = await http.send('DELETE',`api/watchlist/${stock.Symbol}`, payload);
	
		if(deleteSymbol){
			http.getWatchlist(setCurrentWatchlist);
		}
	}
	
	const onListItemClick = (e, data) => {
		e.preventDefault();
		var symbolText = document.getElementById('symbol');
		symbolText.value = data.Symbol;
		setSymbol(data.Symbol);
	}
	// console.log({url, userData, barChartData, minuteIndex: url.indexOf('Minute')})
	return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="nav tabs example"
                    >
                    <LinkTab label="Patterns" {...a11yProps(0)} />
                    <LinkTab label="Watchlist" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
			<TabPanel value={value} index={0}>
				<Grid container>
					<Grid item xs={12} > 
						<Paper className={`${classes.watchlistBar} ${classes.head}`}>
							<Typography variant="h6" component="h2" className={classes.title}>
								Patterns for: {chartText}
							</Typography>
						</Paper>
						<OrderDialog
							patternCandles={patternCandles}
							setOrderResponseData={setOrderResponseData}
							setShowResponse={setShowResponse}
							userData={userData}
						/>
						{showResponse ?
							<TerminalDialog 
								jsonData={orderResponseData}
								showResponse={showResponse}
								setShowResponse={setShowResponse}
							/>
							: ''
						}
					</Grid>
				</Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
				<Grid container>
					<Grid item xs={12} > 
						<Paper className={`${classes.watchlistBar} ${classes.head}`}>
							<Typography variant="h5" component="h2" className={classes.title}>
								Watchlist
							</Typography>
							<FormDialog handleClick={handleAddWatchlist}/>
						</Paper>
						<Paper className={classes.watchlistContainer} >
							{currentWatchlist && currentWatchlist.length > 0 && currentWatchlist.map((stock) => (
								<Paper className={classes.watchlistItem}  key={stock.Symbol} >
									<WatchlistGrid 
										stock={stock}
										onListItemClick={onListItemClick}
										handleDeleteWatchlist={handleDeleteWatchlist}
									/>
								</Paper >
							))}
						</Paper>
					</Grid>
				</Grid>
				
            </TabPanel>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
        height: window.innerHeight - 116,
        overflow: "hidden",
	},
	watchlistBar:{
		height: '62px',
		display: 'flex',
		justifyContent: 'space-between',
	},
	title: {
		padding: '16px',
	},
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	watchlistItem: {
		cursor: 'pointer',
	},
	watchlistContainer: {
		overflowY: 'auto',
        height: (window.innerHeight - 227),
	}
}));

