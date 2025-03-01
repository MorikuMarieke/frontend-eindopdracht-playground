import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom';
import {AuthContextProvider} from './context/AuthContext.jsx';
import {HelmetProvider} from 'react-helmet-async';
import {SpotifyContextProvider} from './context/SpotifyContext.jsx';


createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <HelmetProvider>
            <Router>
                <AuthContextProvider>
                    <SpotifyContextProvider>
                        <App/>
                    </SpotifyContextProvider>
                </AuthContextProvider>
            </Router>
        </HelmetProvider>
    // </StrictMode>,
);
