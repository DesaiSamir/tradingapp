import React, { useState, useContext, useEffect } from "react";
import _ from "lodash";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { 
	Paper, AppBar, Tabs, Tab, Box, Grid, Typography 
} from '@material-ui/core';
import OrderDialog from '../formcontrols/OrderDialog';
import FormDialog from '../formcontrols/FormDialog';
import WatchlistGrid from '../cards/WatchlistGrid';
import helper from '../../utils/helper';
import { ChartActionsContext } from "../../contexts/ChartActionsProvider";
import SimpleSelect from "../formcontrols/SimpleSelect";
import DatePickers from "../formcontrols/DatePicker";

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

export default function PatternsPanel() {
	const classes = useStyles();
	const { 
		barChartData, chartText, symbol, currentWatchlist, currentPatterns, patternTypes, timeframes,
	} = useContext(ChartActionsContext);
    var patternCandles = helper.getPatternCandleList(_.clone(barChartData), symbol);
	const [value, setValue] = useState(0);
	const [displayPatterns, setDisplayPatterns] = useState([]);
	const [displayTimeframes, setDisplayTimeframes] = useState([]);

	useEffect(() => {
		setDisplayPatterns(currentPatterns);
		setDisplayTimeframes(timeframes);
	}, [currentPatterns, timeframes]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	
	const onSelectChange = (e, name, items) => {
		const id = e.target.value;
		const item = items.filter(item => item.id === id)[0];
		switch (name) {
			case 'types':
				// console.log({currentPatterns, filtered: currentPatterns.filter(items => items[1].title === item.title)})
				setDisplayPatterns(currentPatterns.filter(items => items[1].title === item.title));
				break;
			
			case 'timeframes':
				// console.log({timeframes, filtered: item})
				setDisplayPatterns(currentPatterns.filter(items => items[1].timeframe === item.title));
				break;
				
			default:
				break;
		}
	}

	const onDateChange = (e, name) => {
		console.log({e, name})
	}

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
                    <LinkTab label="Pattern List" {...a11yProps(3)} />
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
						/>
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
							<FormDialog />
						</Paper>
						<Paper className={classes.watchlistContainer} >
							{currentWatchlist && currentWatchlist.length > 0 && currentWatchlist.map((stock) => (
								<Paper className={classes.watchlistItem}  key={stock.Symbol} >
									<WatchlistGrid 
										stock={stock}
									/>
								</Paper >
							))}
						</Paper>
					</Grid>
				</Grid>
				
            </TabPanel>
			<TabPanel value={value} index={2}>
				<Grid container>
					<Grid item xs={12} > 
						<Paper className={`${classes.watchlistBar}`}>
							<SimpleSelect 
								onSelectChange={onSelectChange}
								name="timeframes"
								menuItems={displayTimeframes.timeframes}
								defaultValue={4}
								title="Timeframes"
							/>
							<SimpleSelect 
								onSelectChange={onSelectChange}
								name="types"
								menuItems={patternTypes.pattern_types}
								defaultValue={1}
								title="Pattern Types"
							/>
							<DatePickers 
								title="Select Date"
								name="patternDate"
								onDateChange={onDateChange}
							/>
						</Paper>
						<OrderDialog
							patternCandles={displayPatterns}
						/>
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
	},
}));

