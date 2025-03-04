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
    const [favoritePlaylists, setFavoritePlaylists] = useState(() => {
        const storedFavorites = localStorage.getItem("favoritePlaylists");
        return storedFavorites ? JSON.parse(storedFavorites) : [];
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
                localStorage.removeItem('token');
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
            const result = await axios.get( `${NOVI_PLAYGROUND_BACKEND}/users/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            toggleIsAuth(prevState => ({
                ...prevState,
                isAuth: true,
                user: {
                    username: result.data.username,
                    email: result.data.email,
                },
                status: 'done',
            }));

            if (redirectUrl) {
                navigate(redirectUrl);
            }
            console.log(result.data);

        } catch (e) {
            console.error('Error fetching user data:', e);
            localStorage.removeItem('token');
            toggleIsAuth( {
                isAuth: false,
                user: {},
                status: 'done',
            });
        }
    }

    const addFavoritePlaylist = (playlistId) => {
        if (!playlistId) return;

        setFavoritePlaylists((prevFavorites) => {
            if (!prevFavorites.includes(playlistId)) {
                const updatedFavorites = [...prevFavorites, playlistId];
                localStorage.setItem("favoritePlaylists", JSON.stringify(updatedFavorites));
                console.log(updatedFavorites);
                return updatedFavorites;
            }
            return prevFavorites;
        });
    };

    const removeFavoritePlaylist = (playlistId) => {
        setFavoritePlaylists((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter((id) => id !== playlistId);
            localStorage.setItem("favoritePlaylists", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    const clearFavoritePlaylists = () => {
        setFavoritePlaylists([]);
        localStorage.removeItem("favoritePlaylists");
    };

    const contextData = {
        isAuth: isAuth.isAuth,
        user: isAuth.user,
        signIn,
        signOut,
        favoritePlaylists,
        addFavoritePlaylist,
        removeFavoritePlaylist,
        clearFavoritePlaylists,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {isAuth.status === 'done' ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}