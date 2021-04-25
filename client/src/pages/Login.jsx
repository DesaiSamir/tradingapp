import { makeStyles } from '@material-ui/core/styles';
import { data } from '../data'
import { 
    ButtonBase, Typography, 
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',
        height: window.innerHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
    },
    image: {
        position: 'relative',
        backgroundColor: theme.palette.info.dark,// '#3f51b5',
        width: 200,
        height: 200,
        [theme.breakpoints.down('xs')]: {
            width: '100% !important', // Overrides inline-style
            height: 100,
        },
        '&:hover, &$focusVisible': {
            zIndex: 1,
            '& $imageBackdrop': {
            opacity: 0.15,
            },
            '& $imageMarked': {
            opacity: 0,
            },
            '& $imageTitle': {
            border: '4px solid currentColor',
            },
        },
    },
    focusVisible: {},
    imageButton: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.common.white,
    },
    imageSrc: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
    },
    imageBackdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageTitle: {
        position: 'relative',
        padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
    },
    imageMarked: {
        height: 3,
        width: 18,
        backgroundColor: theme.palette.common.white,
        position: 'absolute',
        bottom: -2,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
}));

const Login = () => {
    const classes = useStyles();
    const { img, name, href, color } = data[0];
    const NAME = name.charAt(0).toUpperCase() + name.substring(1, name.length);

    return (
        <div className={classes.root}>
            <ButtonBase
                focusRipple
                key="tsLogin"
                className={classes.image}
                focusVisibleClassName={classes.focusVisible}
                onClick={() => window.location = href}
                style={{
                    backgroundColor: color,
                }}
            >
                <span
                    className={classes.imageSrc}
                    style={{
                        backgroundImage: `url(${img})`,
                    }}
                />
                <span className={classes.imageBackdrop} />
                <span className={classes.imageButton}>
                    <Typography
                        component="span"
                        variant="subtitle1"
                        color="inherit"
                        className={classes.imageTitle}
                    >
                        {NAME}
                        <span className={classes.imageMarked} />
                    </Typography>
                </span>
            </ButtonBase>
        </div>
    )
}

export default Login;
