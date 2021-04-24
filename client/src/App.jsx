import { Paper } from '@material-ui/core';
import Footer from "./components/footer/Footer";
import { makeStyles } from '@material-ui/core/styles';
import Home from "./pages/Home";
import UserProvider from "./contexts/UserProvider";

const useStyles = makeStyles((theme) => ({
	content: {
		WebkitOverflowScrolling: 'touch',
		height: window.innerHeight - 50,
    },
	
}));

const App = () => {
	const classes = useStyles();

	return (
		<Paper className={classes.content}>
			<UserProvider>
				<Home />
				<Footer />
			</UserProvider>
		</Paper>
	);
};
  
export default App;
