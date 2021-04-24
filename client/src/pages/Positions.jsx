import { makeStyles } from '@material-ui/core/styles';
import PositionsTable from "../components/displays/PositionsTable";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Positions = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <PositionsTable />
        </div>
    )
}

export default Positions
