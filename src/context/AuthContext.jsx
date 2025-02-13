import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {NOVI_PLAYGROUND_BACKEND} from '../constants/constants.js';

export const AuthContext = createContext({});

export function AuthContextProvider({ children }) {
    const [isAuth, toggleIsAuth] = useState({
        isAuth: false,
        user: {},
        status: 'pending',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                void fetchUserData(decoded.sub, token);
            } catch (e) {
                console.error('Error with decoding token:', e);
                localStorage.removeItem('token'); // Verwijder corrupte token
                toggleIsAuth({
                    isAuth: false,
                    user: {},
                    status: 'done',
                });
            }
        } else {
            toggleIsAuth({
                isAuth: false,
                user: {},
                status: 'done',
            });
        }
    }, []);

    async function signIn(JWT) {
        try {
            localStorage.setItem('token', JWT);
            const decodedToken = jwtDecode(JWT);
            await fetchUserData(decodedToken.sub, JWT, '/profile');
            console.log(decodedToken);
        } catch (e) {
            console.error('Error signing in:', e);
            localStorage.removeItem('token');
            toggleIsAuth({
               isAuth: false,
               user: {},
               status: 'done',
            });
        }
    }

    function signOut() {
        localStorage.removeItem('token');
        toggleIsAuth( {
            isAuth: false,
            user: {},
            status: 'done',
        });

        console.log( 'Gebruiker is uitgelogd!' );
        navigate('/');
    }

    async function fetchUserData(username, token, redirectUrl) {
        try {
            // haal gebruikersdata op met de token en id van de gebruiker
            const result = await axios.get( `${NOVI_PLAYGROUND_BACKEND}users/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // zet de gegevens in de state
            toggleIsAuth(prevState => ({
                ...prevState,
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                },
                status: 'done',
            }));

            // als er een redirect URL is meegegeven (bij het mount-effect doen we dit niet) linken we hiernnaartoe door
            // als we de history.push in de login-functie zouden zetten, linken we al door voor de gebuiker is opgehaald!
            if (redirectUrl) {
                navigate(redirectUrl);
            }
            console.log(result.data); //log to check if user data is fetched correctly.

        } catch (e) {
            console.error('Error fetching user data:', e);
            localStorage.removeItem('token');
            // ging er iets mis? Plaatsen we geen data in de state
            toggleIsAuth( {
                isAuth: false,
                user: {},
                status: 'done',
            });
        }
    }

    const contextData = {
        isAuth: isAuth.isAuth,
        user: isAuth.user,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isAuth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}