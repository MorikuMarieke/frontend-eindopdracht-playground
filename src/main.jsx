import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom';

createRoot(document.getElementById('root')).render(

    <StrictMode>
        <Router>
            <link rel="icon" type="image/png" href="/favicon.ico"/>
            <App/>
        </Router>
    </StrictMode>,
)
