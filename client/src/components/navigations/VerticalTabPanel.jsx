import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Profile from "../../pages/Profile";
// import Market from "../../pages/Market";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import StockChart from "../displays/BasicCandlestick";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Terminal from "../displays/Terminal";
import SimpleTextField from '../formcontrols/SimpleTextField';
import SimpleSelect from "../formcontrols/SimpleSelect";
import DatePicker from "../formcontrols/DatePicker";
import SimpleButton from "../formcontrols/SimpleButton";
import { Paper } from '@material-ui/core';
import http from '../../utils/http';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
			>
				{value === index && (
					<Box p={3} style={{padding:0,}} >
						{children}
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
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		width: "50px",
		minWidth: "50px",
	},
	tab: {

		minWidth: "50px",
	},
	tabPanel: {
		width: window.innerWidth - 50,
		height: window.innerHeight - 100,
        overflowY: 'auto',
	},
	formcontrols: {
		// display: 'block',
		flexDirection: 'row',
        display: 'flex',
        // justifyContent: 'space-between',
        width: '100%',
	}
}));

function LinkTab(props) {
	const classes = useStyles();
	return (
	  <Tab
	  	className={classes.tab}
		component="a"
		onClick={(event) => {
		  event.preventDefault();
		}}
		{...props}
	  />
	);
}

const units = [
	{
		id: 1, 
		title: 'Minute',
		value: 'Minute'
	},
	{
		id: 2, 
		title: 'Daily',
		value: 'Daily'
	},
	{
		id: 3, 
		title: 'Weekly',
		value: 'Weekly'
	},
	{
		id: 4, 
		title: 'Monthly',
		value: 'Monthly'
	}
];

const intervals = [
	{
		id: 1, 
		title: 1,
		value: 1
	}, 
	{
		id: 5, 
		title: 5,
		value: 5
	}, 
	{
		id: 10, 
		title: 10,
		value: 10
	}, 
	{
		id: 15, 
		title: 15,
		value: 15
	}, 
	{
		id: 30, 
		title: 30,
		value: 30
	}, 
	{
		id: 60, 
		title: 60,
		value: 60
	}, 
	{
		id: 240, 
		title: 240,
		value: 240
	}, 
	{
		id: 480, 
		title: 480,
		value: 480
	}
];

export default function VerticalTabs({url, userData, stockQuote, barChartData, symbol, onTextChanged, onSelectChange, onDateChange}) {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const dateTimeFormat= url && url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Paper className={`${classes.root}`}>
			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				className={classes.tabs}
			>
				<LinkTab href="/quote" icon={<TrendingUpIcon />} {...a11yProps(0)} />
				<LinkTab href="/chart" icon={<CodeIcon />} {...a11yProps(1)} />
				<LinkTab href="/json" icon={<CodeIcon />} {...a11yProps(2)} />
				<LinkTab href="/profile" icon={<AccountCircleIcon />} {...a11yProps(3)} />
			</Tabs>
			<TabPanel className={classes.tabPanel} value={value} index={0}>
				<div className={classes.formcontrols}>
					<SimpleTextField id="symbol" label="Symbol" name="symbol" onChange={onTextChanged} defaultValue={symbol} />
					<SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="unit" menuItems={units} title="Select Unit" defaultValue="1" />
					<SimpleSelect parentStyles={useStyles} onSelectChange={onSelectChange} name="interval" menuItems={intervals} title="Select Interval" defaultValue={"15"} />
					<DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Last Date" name="lastDate" />
					<SimpleTextField parentStyles={useStyles} id="daysBack" name="daysBack" label="Days Back" onChange={onTextChanged} defaultValue={"30"} type="number" />
                    <SimpleButton text="Stop Data" name="StopData" onClick={http.clearApiInterval} />
				</div>
                
                {/* {api.isStartDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Start Date" name="startDate" /> : ''}
                {api.isEndDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="End Date" name="endDate" /> : ''}
                {api.isLastDate ? <DatePicker parentStyles={useStyles} onDateChange={onDateChange} title="Last Date" name="lastDate" /> : ''}
                {api.isDaysBack ? <SimpleTextField parentStyles={useStyles} id="daysBack" name="daysBack" label="Days Back" onChange={onTextChanged} defaultValue={daysBack} type="number" /> : ''}
                {api.isBarsBack ? <SimpleTextField parentStyles={useStyles} id="barsBack" name="barsBack" label="Bars Back" onChange={onTextChanged} defaultValue={barsBack} type="number" /> : ''} */}
            
				{
					(barChartData && barChartData.length > 0) ? 
						<StockChart dateTimeFormat={dateTimeFormat} data={barChartData} symbol={symbol} />
					: <div>Loading...</div>
				}
			</TabPanel>
			<TabPanel className={classes.tabPanel} value={value} index={1}>
				{/* <Market parentStyles={useStyles} /> */}
				<Terminal 
                    title={url}
                    userData={barChartData} 
                />
			</TabPanel>
			<TabPanel className={classes.tabPanel} value={value} index={2}>
				<Terminal 
                    title={url}
                    userData={stockQuote} 
                />
			</TabPanel>
			<TabPanel className={classes.tabPanel} value={value} index={3}>
				<Profile userData={userData}/>
			</TabPanel>
		</Paper>
	);
}
