import { makeStyles } from '@material-ui/core/styles';
import SettingsTable from "../components/displays/SettingsTable";


const Admin = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <SettingsTable />
        </div>
    )
}

export default Admin

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));