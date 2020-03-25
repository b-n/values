import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import * as serviceWorker from './serviceWorker';
import './index.css';
import App from './App';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#A68B50',
      dark: '#594519'
    },
    secondary: {
      main: '#8DAEF2',
    }
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
