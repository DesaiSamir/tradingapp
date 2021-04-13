import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Box, Paper } from '@material-ui/core';
import Profile from "../../pages/Profile";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import Market from "../../pages/Market";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Terminal from "../displays/Terminal";

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
};

export default function VerticalTabs({url, userData, stockQuote, barChartData, symbol, chartText, onTextChanged, onSelectChange, onDateChange, setSymbol}) {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
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
				<Market 
					url={url}
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
			</TabPanel>
			<TabPanel className={classes.tabPanel} value={value} index={1}>
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
