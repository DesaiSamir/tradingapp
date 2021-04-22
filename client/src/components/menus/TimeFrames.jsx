import { makeStyles, fade } from '@material-ui/core/styles';
import { 
    IconButton, InputBase
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import StopDataIcon from '@material-ui/icons/StopScreenShare';
import PreMarketIcon from '@material-ui/icons/WatchLater';
import http from "../../utils/http";

const TimeFrames = ({onUnitClicked, setIsPreMarket, onTextChanged}) => {
    const classes = useStyles();
    
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

    return (
        <div className={classes.root}>
            <div className={classes.sectionDesktop}>
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
                    color="secondary"
                    name="PreMarket"
                    title="Pre Post Data Pull"
                    onClick={() => {setIsPreMarket(true); }}
                >
                    <PreMarketIcon />
                </IconButton>
                <IconButton
                    aria-label="stop data pull"
                    color="inherit"
                    name="StopData"
                    title="Stop Data Pull"
                    onClick={() => {http.clearBarChartInterval(); http.clearQuoteInterval(); }}
                >
                    <StopDataIcon />
                </IconButton>
            
            </div>
        </div>
    )
}

export default TimeFrames

const useStyles = makeStyles((theme) => ({
	root: {
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
        marginTop: '3px',
		marginLeft: 0,
        height: '40px',
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
        height: '25px',
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
