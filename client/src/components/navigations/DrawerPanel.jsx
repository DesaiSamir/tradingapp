import React from 'react';
import clsx from 'clsx';
import _ from "lodash";
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { 
    Drawer, AppBar, List, CssBaseline, Typography, Divider, IconButton, 
	ListItem, ListItemIcon, ListItemText, Toolbar, InputBase, MenuItem, Menu
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import CodeIcon from '@material-ui/icons/Code';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import LogoutIcon from "@material-ui/icons/MeetingRoom";
import LoginIcon from '@material-ui/icons/VpnKey';
import StopDataIcon from '@material-ui/icons/StopScreenShare';
import PreMarketIcon from '@material-ui/icons/WatchLater';
import Terminal from "../displays/Terminal";
import Profile from "../../pages/Profile";
import Market from "../../pages/Market";
import http from "../../utils/http";

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
		marginTop: `${appBarHeight}px`,
		overflowY: 'auto',
		height: window.innerHeight - 117
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
	menuButton: {
	  	marginRight: theme.spacing(2),
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
	  	},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
	  	color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
	spacer: {
		marginRight: theme.spacing(2),
	},
    buttonText: {
        ...theme.typography.button,
		marginRight: theme.spacing(.5),
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
	const unitIntervalList = [
		{
			id: '1m',
			unit: 'Minute',
			interval: '1',
		},
		{
			id: '2m',
			unit: 'Minute',
			interval: '2',
		},
		{
			id: '5m',
			unit: 'Minute',
			interval: '5',
		},
		{
			id: '15m',
			unit: 'Minute',
			interval: '15',
		},
		{
			id: '60m',
			unit: 'Minute',
			interval: '60',
		},
		{
			id: '240m',
			unit: 'Minute',
			interval: '240',
		},
		{
			id: 'D',
			unit: 'Daily',
			interval: '1',
		},
		{
			id: 'W',
			unit: 'Weekly',
			interval: '1',
		},
		{
			id: 'M',
			unit: 'Monthly',
			interval: '1',
		},
	];
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
							unitIntervalList.map((item) => (
								<IconButton
									aria-label={`${item.id} data pull`}
									className={classes.buttonText}
									color="inherit"
									name={item.id}
									key={item.id}
									id={item.id}
									title={`${item.unit === 'Minute' ? item.interval : ''} ${item.unit}`}
									onClick={(e) => {onUnitClicked(e, item); }}
								>
									{item.id}
								</IconButton>
							))
						}
						<IconButton
							aria-label="regular session data pull"
							color="inherit"
							name="RegularSession"
							title="Regular Session"
							onClick={() => {setIsPreMarket(false); }}
						>
							<PreMarketIcon />
						</IconButton>
						<IconButton
							aria-label="pre - post data pull"
							color="default"
							name="PreMarket"
							title="Pre Post Data Pull"
							onClick={() => {setIsPreMarket(true); }}
						>
							<PreMarketIcon />
						</IconButton>
					</div>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Stock code..."
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
							id="symbol"
							name="symbol"
							onKeyDown = {(e) => onTextChanged(e, "symbol")}
						/>
					</div>
					<IconButton
						aria-label="stop data pull"
						color="inherit"
						name="StopData"
						title="Stop Data Pull"
						onClick={() => {http.clearBarChartInterval(); http.clearQuoteInterval(); }}
					>
						<StopDataIcon />
					</IconButton>
					<div className={classes.spacer} />
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
					<ListItemIcon><CodeIcon /></ListItemIcon>
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
							<Terminal 
								title={url}
								userData={null} 
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
							/>
					}
				</div>
			</main>
		</div>
	);
}
