import { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Terminal from "../components/displays/Terminal";
import { Paper, Grid } from "@material-ui/core";
import { UserContext } from "../contexts/UserProvider";
import { BalanceContext } from "../contexts/BalanceProvider";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "5px",
    },
	spacer: {
        margin: "25px",
	},
    stockList:{
        height: `calc(100% - 62px)`,
    },
    watchlistBar:{
        height: '62px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    title: {
        padding: '16px',
    },
}));

const Profile = () => {
    const classes = useStyles();
    const { userProfile } = useContext(UserContext);
    const { balanceInfo } = useContext(BalanceContext);
    
    return (
        <Paper className={classes.root}>
            <Grid container>
                <Grid item xs={6}> 
                    <Terminal
                        jsonData={userProfile}
                        title="Profile Data"
                    />
                </Grid>
                <Grid item xs={6}> 
                    <Terminal
                        jsonData={balanceInfo}
                        title="Balance Data"
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default Profile;