import React from 'react';
import clsx from 'clsx';
import _ from "lodash";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { 
    Drawer, AppBar, List, CssBaseline, Typography, Divider, IconButton, 
	ListItem, ListItemIcon, ListItemText, Toolbar, MenuItem, Menu
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
import Terminal from "../displays/Terminal";
import Profile from "../../pages/Profile";
import Market from "../../pages/Market";
import Orders from '../../pages/Orders';

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
		// height: window.innerHeight - 117
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
}));

export default function DrawerPanel({url, userData, stockQuote, barChartData, symbol, chartText, onTextChanged, onUnitClicked, setIsPreMarket, setSymbol}) {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);  
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
	const [component, setComponent] = React.useState("Home");

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
				!_.isEmpty(userData) ?
					<div>
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
						Trading-bot
					</Typography>
					<div className={classes.grow} />
					<div className={classes.sectionDesktop}>
						{   
							!_.isEmpty(userData) ?
								<div>
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
					<ListItem button key={"Market"} onClick={()=> setComponent("Market")}>
					<ListItemIcon><TrendingUpIcon /></ListItemIcon>
					<ListItemText primary={"Chart"} />
					</ListItem>
					<ListItem button key={"ChartData"} onClick={()=> setComponent("ChartData")}>
					<ListItemIcon><ReceiptIcon /></ListItemIcon>
					<ListItemText primary={"ChartData"} />
					</ListItem>
					<ListItem button key={"Quote"} onClick={()=> setComponent("Quote")}>
					<ListItemIcon><CodeIcon /></ListItemIcon>
					<ListItemText primary={"Primary Quote"} />
					</ListItem>
					<ListItem button key={"Profile"} onClick={()=> setComponent("Profile")}>
					<ListItemIcon><AccountCircleIcon /></ListItemIcon>
					<ListItemText primary={"Profile"} />
					</ListItem>
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={open ? classes.containerOpen : classes.containerClose}>
					{
						component === 'ChartData' ?
							<Orders
								userData={userData}
							/>
						:
						component === 'Profile' ?
							<Profile userData={userData}/>
						:
						component === 'Quote' ?
							<Terminal 
								title={url}
								userData={stockQuote} 
							/>
						:
							<Market 
								url={url}
								barChartData={barChartData} 
								symbol={symbol}
								setSymbol={setSymbol}
								chartText={chartText}
								userData={userData}
								onUnitClicked={onUnitClicked}
								setIsPreMarket={setIsPreMarket}
								onTextChanged={onTextChanged}
							/>
					}
				</div>
			</main>
		</div>
	);
}
