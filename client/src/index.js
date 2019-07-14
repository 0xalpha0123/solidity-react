import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';

import './index.sass';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div>
        <App />
        <ToastContainer />
    </div>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
