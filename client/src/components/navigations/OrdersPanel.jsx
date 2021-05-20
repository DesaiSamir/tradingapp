import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import Positions from '../../pages/Positions';
import { OrderContext } from '../../contexts/OrderProvider';
import OrdersTable from '../displays/OrdersTable';

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
				<Box>
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

export default function OrdersPanel() {
	const classes = useStyles();
	const { lastSelTabOrdPos, setLastSelTabOrdPos, activeOrders } = useContext(OrderContext);
	const handleChange = (event, newValue) => {
		setLastSelTabOrdPos(newValue);
	};
	
	return (
        <div className={classes.root}>
            <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={lastSelTabOrdPos}
                    onChange={handleChange}
                    aria-label="nav tabs example"
				>
                    <LinkTab label="Orders" {...a11yProps(0)} />
                    <LinkTab label="Active Positions" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
			<TabPanel value={lastSelTabOrdPos} index={0}>
				<OrdersTable  containerHeight={270} orders={activeOrders} />
            </TabPanel>
            <TabPanel value={lastSelTabOrdPos} index={1}>
				<Positions />
            </TabPanel>
        </div>
    );
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
        // overflow: "hidden",
		// height: '100%',
	},
}));
