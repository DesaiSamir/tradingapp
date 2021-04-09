import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Terminal from "../displays/Terminal";
import { Paper } from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import StockChart from "../displays/BasicCandlestick";

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
        <Box p={3}>
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NavTabs({url, userData, barChartData}) {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const dateTimeFormat= url.indexOf('Minute') > 0 ? "%d %b %H:%M %p" : "%d %b";
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
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
                    <LinkTab href="/quote" icon={<CodeIcon />} {...a11yProps(0)} />
                    <LinkTab href="/chart" icon={<TrendingUpIcon />} {...a11yProps(1)} />
                    <LinkTab href="/json" icon={<CodeIcon />} {...a11yProps(2)} />
                </Tabs>
            </AppBar>
			<TabPanel value={value} index={0}>
                <Terminal 
                    title={url}
                    userData={userData} 
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                {(barChartData.length > 0) ? 
					<StockChart dateTimeFormat={dateTimeFormat} data={barChartData} />
                : <div>Loading...</div>}
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Terminal 
                    title={url}
                    userData={barChartData} 
                />
            </TabPanel>
        </div>
    );
}
