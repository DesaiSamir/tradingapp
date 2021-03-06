import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from "lodash";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { 
    Drawer, AppBar, List, CssBaseline, Typography, Divider, IconButton, 
	ListItem, ListItemIcon, ListItemText, Toolbar, MenuItem, Menu, Grid, FormControlLabel, Checkbox
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MoreIcon from '@material-ui/icons/MoreVert';
import LogoutIcon from "@material-ui/icons/MeetingRoom";
import LoginIcon from '@material-ui/icons/VpnKey';
import ReceiptIcon from '@material-ui/icons/Receipt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Terminal from "../displays/Terminal";
import Profile from "../../pages/Profile";
import Market from "../../pages/Market";
import Admin from "../../pages/Admin";
import { UserContext } from '../../contexts/UserProvider';
import Positions from '../../pages/Positions';
import { ChartActionsContext } from '../../contexts/ChartActionsProvider';
import { BalanceContext } from '../../contexts/BalanceProvider';
import OrdersTable from '../displays/OrdersTable';
import { OrderContext } from '../../contexts/OrderProvider';

const drawerWidth = 240;
const contentWidthOpen = window.innerWidth - drawerWidth;
const contentWidthClose = window.innerWidth - 73;
const appBarHeight = 64;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		height: `${appBarHeight}px`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		marginTop: `${appBarHeight - 5}px`,
		overflowY: 'auto',
	},
	containerOpen: {
		width: `${contentWidthOpen}px`,
	},
	containerClose: {
		width: `${contentWidthClose}px`,
	},
	grow: {
		flexGrow: 1,
	},
	buttonText: {
		...theme.typography.button,
		padding: '0px 5px',
	},
	loggedIn:{
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	spacer: {
		padding: theme.spacing(1),
	},
	up: {
		color: theme.palette.success.dark,
		textAlign: 'center',
	},
	down: {
		color: 'red',
		textAlign: 'center',
	},
	gridContainer: {
		width: 230,
		backgroundColor: theme.palette.primary.dark,
	},
	cardContainer: {
		maxWidth: 600,
		maxHeight: 49,
	},
	cards: {
		display: 'flex',
		flexWrap: 'wrap',
		height: 49,
		backgroundColor: theme.palette.primary.dark,
		flexDirection: 'row',
	},
	card: {
		width: 120,
		height: 24.5,
		cursor: 'pointer',
	}
}));

export default function DrawerPanel() {
	const classes = useStyles();
	const theme = useTheme();
	const { userId } =  useContext(UserContext);
	const { stockQuote, setSymbolText, isRegularSession, handleChangeRegularSession } = useContext(ChartActionsContext);
	const { realizedPnL, unRealizedPnL, closedPositions } = useContext(BalanceContext);
	const { orders, totalFilledOrders } = useContext(OrderContext)
	const [open, setOpen] = useState(false);  
	const [anchorEl, setAnchorEl] = useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [component, setComponent] = useState("Home");
	const [todaysPnL, setTodaysPnL] = useState(0);

	useEffect(() => {
		setTodaysPnL(parseFloat(parseFloat(realizedPnL) + totalFilledOrders).toFixed(2));
	}, [totalFilledOrders, realizedPnL]);

	const handleProfileMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};
	
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
		  anchorEl={anchorEl}
		  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		  id={menuId}
		  keepMounted
		  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		  open={isMenuOpen}
		  onClose={handleMenuClose}
		>
		  <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
		  <MenuItem onClick={handleMenuClose}>My account</MenuItem>
		</Menu>
	  );
	
	  const mobileMenuId = 'primary-search-account-menu-mobile';
	  const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			{   
				!_.isNull(userId) ?
					<div>
						<Typography className={classes.buttonText}>
							Welcome, {userId}!
						</Typography>
						<MenuItem onClick={handleProfileMenuOpen}>
							<IconButton
								aria-label="account of current user"
								aria-controls="primary-search-account-menu"
								aria-haspopup="true"
								color="inherit"
							>
								<AccountCircleIcon />
							</IconButton>
							<p>Profile</p>
						</MenuItem>
						<MenuItem button href={"api/logout"}>
							<IconButton
								aria-label="logout of current user"
								href={"api/logout"}
								title="Logout"
								color="inherit"
							>
								<LogoutIcon />
							</IconButton>
							<p>Logout</p>
						</MenuItem>
						<MenuItem>
							<FormControlLabel
								control={<Checkbox checked={isRegularSession} onChange={handleChangeRegularSession} name="IsRegularSession" />}
								label="Override Session"
							/>
						</MenuItem>
					</div>
				: 
					<MenuItem href={"api/login"}>
						<IconButton
							aria-label="login for current user"
							href={"api/login"}
							title="Login"
							color="inherit"
						>
							<LoginIcon />
						</IconButton>
						<p>Login</p>
					</MenuItem>
			}
		</Menu>
	);
	
	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open,
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						Pattern Trading Bot
					</Typography>
					<div className={classes.grow} />
					<div className={classes.cardContainer}>
						<Grid container className={classes.cards}>
							{
								closedPositions && closedPositions.map( (p) => {
									return (
										<Grid container key={p.Symbol} className={`${classes.buttonText} ${classes.card}`} onClick={() => setSymbolText(p.Symbol)}>
											<Grid item xs={5}>
												{p.Symbol}: 
											</Grid>
											<Grid item xs={7} className={p.Profit >= 0 ? classes.up : classes.down}>
												{p.Profit >= 0 ? `$${parseFloat(p.Profit).toFixed(2)}` : `$${parseFloat(p.Profit).toFixed(2) * -1}`}
											</Grid>
										</Grid>
									)
								})
							}
						</Grid>
					</div>
					<div>
						<Grid container className={classes.gridContainer}>
							<Grid item xs={8} >
								<Typography  variant="h6" noWrap className={classes.buttonText}>
									Today's PnL: 
								</Typography>
							</Grid>
							<Grid item xs={4} >
								<Typography  variant="h6" noWrap className={`${classes.buttonText} ${todaysPnL >= 0 ? classes.up : classes.down}`}>
									{(todaysPnL) >= 0 ? `$${todaysPnL}` : `$${todaysPnL * -1}`}
								</Typography>
							</Grid>
							<Grid item xs={8}>
								<Typography  variant="h6" noWrap className={classes.buttonText}>
									Unrealized PnL: 
								</Typography>
							</Grid>
							<Grid item xs={4}>
								<Typography  variant="h6" noWrap className={`${classes.buttonText} ${unRealizedPnL >= 0 ? classes.up : classes.down}`}>
									{unRealizedPnL >= 0 ? `$${unRealizedPnL}` : `$${unRealizedPnL * -1}`}
								</Typography>
							</Grid>
						</Grid>
					</div>
					<div className={classes.sectionDesktop}>
						{   
							!_.isNull(userId) ?
								<div className={classes.loggedIn}>
									<Typography  variant="h6" noWrap className={classes.buttonText}>
										Welcome, {userId}!
									</Typography>
									<div className={classes.spacer} />
									<IconButton
										edge="end"
										aria-label="account of current user"
										aria-controls={menuId}
										aria-haspopup="true"
										title="Account Info"
										onClick={handleProfileMenuOpen}
										color="inherit"
									>
										<AccountCircleIcon />
									</IconButton>
									<div className={classes.spacer} />
									<IconButton
										aria-label="logout of current user"
										href={"api/logout"}
										title="Logout"
										color="inherit"
									>
										<LogoutIcon />
									</IconButton>
								</div>
							: 
								<IconButton
									aria-label="login for current user"
									href={"api/login"}
									title="Login"
									color="inherit"
								>
									<LoginIcon />
								</IconButton>
						}
					</div>
					<div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					}),
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					<ListItem button key={"Chart"} onClick={()=> setComponent("Chart")}>
						<ListItemIcon><TrendingUpIcon /></ListItemIcon>
						<ListItemText primary={"Chart"} />
					</ListItem>
					<ListItem button key={"Orders"} onClick={()=> setComponent("Orders")}>
						<ListItemIcon><ReceiptIcon /></ListItemIcon>
						<ListItemText primary={"Orders"} />
					</ListItem>
					<ListItem button key={"Positions"} onClick={()=> setComponent("Positions")}>
						<ListItemIcon><ListAltIcon /></ListItemIcon>
						<ListItemText primary={"Positions"} />
					</ListItem>
					<ListItem button key={"Quote"} onClick={()=> setComponent("Quote")}>
						<ListItemIcon><CodeIcon /></ListItemIcon>
						<ListItemText primary={"Primary Quote"} />
					</ListItem>
					<ListItem button key={"Profile"} onClick={()=> setComponent("Profile")}>
						<ListItemIcon><AccountCircleIcon /></ListItemIcon>
						<ListItemText primary={"Profile"} />
					</ListItem>
					<ListItem button key={"Admin"} onClick={()=> setComponent("Admin")}>
						<ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
						<ListItemText primary={"Admin"} />
					</ListItem>					
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={open ? classes.containerOpen : classes.containerClose}>
					{
						component === 'Orders' ?
							<OrdersTable  containerHeight={window.innerHeight - 112} orders={orders} />
						:
						component === 'Profile' ?
							<Profile />
						:
						component === 'Positions' ?
							<Positions />
						:
						component === 'Admin' ?
							<Admin />
						:
						component === 'Quote' ?
							<Terminal 
								title='Quote Data'
								jsonData={stockQuote} 
							/>
						:
							<Market />
					}
				</div>
			</main>
		</div>
	);
}
