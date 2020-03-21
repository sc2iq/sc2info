import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from "react-router-dom"
import { Provider, createClient } from 'urql';

const client = createClient({
    url: `${process.env.REACT_APP_SERVICE_URL!}/graphql`,
});

ReactDOM.render(
    <Provider value={client}>
        <Router>
            <App />
        </Router>
    </Provider>
    , document.getElementById('root'))
