import React, {createContext, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import isTokenValid from '../helpers/isTokenValid.js';
import {NOVI_PLAYGROUND_BACKEND} from '../constants/constants.js';
import {AuthContext} from './AuthContext.jsx';


export const SpotifyContext = createContext({});

export function SpotifyContextProvider({children}) {
    const [spotifyAccessToken, setSpotifyAccessToken] = useState(localStorage.getItem('access_token') || null);
    const [spotifyProfileData, setSpotifyProfileData] = useState(JSON.parse(localStorage.getItem('spotify_profile')) || null);
    const [spotifyProfileDataError, setSpotifyUserDataError] = useState(null);

    const navigate = useNavigate();

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get('code');

        if (authorizationCode) {
            exchangeCodeForAccessToken(authorizationCode);
        } else {
            checkAndRefreshToken();
        }
    }, []);

    const redirectToSpotifyAuth = () => {
        const redirectUri = 'http://localhost:5173/profile';
        const scope = 'user-top-read user-library-read playlist-modify-public';
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
    };

    const exchangeCodeForAccessToken = async (authorizationCode) => {
        const redirectUri = 'http://localhost:5173/profile';
        try {
            const response = await axios.post(
                `${SPOTIFY_TOKEN_URL}`,
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: authorizationCode,
                    redirect_uri: redirectUri,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }
            );
            const {access_token, refresh_token} = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            setSpotifyAccessToken(access_token);

            await getSpotifyUserProfile();
            navigate('/profile');
        } catch (error) {
            if (error.response) {
                console.error('Spotify API Error:', error.response.status, error.response.data);
            } else {
                console.error('Unknown Error:', error);
            }
        }
    };

    const getSpotifyUserProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: {Authorization: `Bearer ${token}`},
            });
            setSpotifyProfileData(response.data);
        } catch (error) {
            console.error('Error fetching user profile', error);
            setSpotifyUserDataError("Error fetching Spotify user profile.")
        }
    };

    const refreshSpotifyToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) return null;

        try {
            const response = await axios.post(
                `${SPOTIFY_TOKEN_URL}`,
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                {headers: {"Content-Type": "application/x-www-form-urlencoded"}}
            );
            const {access_token, refresh_token: newRefreshToken} = response.data;
            localStorage.setItem("access_token", access_token);

            if (newRefreshToken) localStorage.setItem("refresh_token", newRefreshToken);
            setSpotifyAccessToken(access_token);
            await getSpotifyUserProfile();

            return access_token;
        } catch (error) {
            console.error("Failed to refresh Spotify token:", error);
        }
    };

    async function checkAndRefreshToken() {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) return;

        if (!isTokenValid(accessToken)) {
            const newAccessToken = await refreshSpotifyToken();
            if (newAccessToken) {
                setSpotifyAccessToken(newAccessToken);
                localStorage.setItem("access_token", newAccessToken);
            }
        }
    }

    async function handleSpotifyLogout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setSpotifyAccessToken(null);
        setSpotifyProfileData(null);
        window.location.reload();
    }

    const contextData = {
        spotifyAccessToken,
        spotifyProfileData,
        setSpotifyProfileData,
        redirectToSpotifyAuth,
        handleSpotifyLogout,
        spotifyProfileDataError,
    };

    return (
        <SpotifyContext.Provider value={contextData}>
            {children}
        </SpotifyContext.Provider>
    );
}