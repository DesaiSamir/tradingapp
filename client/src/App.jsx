import React from 'react';
import { Paper } from '@material-ui/core';

const App = ({children}) => {
    return (
        <Paper style={styles.body}>
          {children}
        </Paper>
    );
};

const styles = {
    appLogo: {
      height: 40,
      animation: 'App-logo-spin infinite 20s linear'
    },
    footer: {
      backgroundColor: '#26C6DA',
      boxShadow: '0 -4px 10px 0px rgba(0,0,0,0.8)',
    },
    body: {
    //   backgroundColor: '#009688',
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    },
    header: {
      boxShadow: '0 4px 10px 0px rgba(0,0,0,0.8)',
      fontFamily: 'MAGNETOB',
    },
    titleStyle: {
      fontSize: '3em',
      textShadow: 'rgb(0, 0, 0) 3px 3px 0px',
    }
  }
  
export default App;
