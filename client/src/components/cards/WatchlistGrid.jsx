import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Paper, Typography, ButtonBase, Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1),
        margin: 'auto',
    },
    image: {
        width: 100,
        height: 40,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    font: {
        fontWeight: 'bold',
    },
    icon: {
        width: 20,
      },
}));


export default function WatchlistGrid({stock, onListItemClick, handleDeleteWatchlist}) {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={1}>
                    <Grid item >
                        <ButtonBase className={classes.image} >
                            <Typography variant="h4" component="h2">
                                {stock.Symbol}
                            </Typography>
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container style={{marginTop:"10px"}}>
                        <Grid item xs container spacing={1} onClick={(e) => onListItemClick(e, stock)}>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Open:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(stock.Open).toFixed(2)}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Close:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {close}
                                    </Typography>
                                </Grid> */}
                            </Grid>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Close:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(stock.Close).toFixed(2)}
                                    </Typography>
                                </Grid>
                                {/* <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        High:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {high}
                                    </Typography>
                                </Grid> */}
                                {/* <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Low:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {low}
                                    </Typography>
                                </Grid> */}
                            </Grid>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        High:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(stock.High).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} container>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom className={classes.font}>
                                        Low:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="button" display="block" gutterBottom>
                                        {parseFloat(stock.Low).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid>
                            <Button
                                onClick={(e) => handleDeleteWatchlist(e, stock)}
                                color="secondary"
                                className={classes.button}
                                endIcon={<DeleteIcon/>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
