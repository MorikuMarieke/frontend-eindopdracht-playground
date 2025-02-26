import React, {useContext, useEffect, useState} from 'react';
import './Profile.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {Pencil, SignOut} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import isTokenValid from '../../helpers/isTokenValid.js';


function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [spotifyAccessToken, setSpotifyAccessToken] = useState(localStorage.getItem('spotify_access_token'));
    const [spotifyProfileData, setSpotifyProfileData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtist, setTopArtist] = useState([]);

    const {isAuth, user, signOut} = useContext(AuthContext);

    const navigate = useNavigate();
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

    useEffect(() => {
        async function getUserData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setInfo(response.data.info);

                // maak ook stukje state voor password en info [v]
                // console.log(response);
            } catch (e) {
                console.error(e);
            }
        }

        getUserData();

    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const authorizationCode = queryParams.get('code');

        if (authorizationCode) {
            // If there's an authorization code, exchange it for an access token
            exchangeCodeForAccessToken(authorizationCode);
        } else {
            // Check for tokens in localStorage only if no code is in the URL
            const accessToken = localStorage.getItem('spotify_access_token');
            const refreshToken = localStorage.getItem('spotify_refresh_token');

            if (accessToken) {
                // Access token found, proceed with normal flow
                getUserSpotifyProfile();
            } else if (refreshToken) {
                // No access token but refresh token found, try to refresh
                checkAndRefreshToken(refreshToken);
            } else {
                // Neither token found, no redirect yet, just show a login message
                console.log("Please log in to Spotify.");
                // Optionally show a UI element prompting the user to log in
            }
        }
    }, []); // This effect is focused on authentication and token management

    // TODO: Right now it works, but only on refresh.

    // Get top tracks if spotify accesstoken is updated.
    useEffect(() => {
        async function getTopTracks() {
            if (!spotifyAccessToken) return;

            const token = localStorage.getItem('spotify_access_token');
            try {
                const response = await axios.get(`${API_BASE}/me/top/tracks`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        limit: 10,
                        time_range: "medium_term"
                    }
                });
                console.log("User top tracks:", response.data)
            } catch (e) {
                console.error(e)
            }
        }
        getTopTracks();
    }, [spotifyAccessToken]);

// Redirect to Spotify authentication page
    const redirectToSpotifyAuth = () => {
        const redirectUri = 'http://localhost:5173/profile';
        const scope = 'user-top-read user-library-read playlist-modify-public';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

        window.location.href = authUrl;
    };

// Exchange authorization code for access token and store tokens
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
                    },
                }
            );

            const {access_token, refresh_token} = response.data;

            // Store tokens in localStorage
            localStorage.setItem('spotify_access_token', access_token);
            localStorage.setItem('spotify_refresh_token', refresh_token);

            setSpotifyAccessToken(access_token); // Update state with the access token

            getUserSpotifyProfile();

            navigate('/profile');
        } catch (error) {
            console.error('Error exchanging authorization code for token:', error);
        }
    };

    const refreshSpotifyToken = async () => {
        const refreshToken = localStorage.getItem("spotify_refresh_token");

        if (!refreshToken) {
            console.error("No refresh token available.");
            return null;
        }

        try {
            const response = await axios.post(
                `${SPOTIFY_TOKEN_URL}`,
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const { spotify_access_token, spotify_refresh_token: newRefreshToken } = response.data;

            // Store new access token
            localStorage.setItem("spotify_access_token", spotify_access_token);

            // If a new refresh token is provided, update it
            if (newRefreshToken) {
                localStorage.setItem("spotify_refresh_token", newRefreshToken);
            }

            console.log("Spotify token refreshed successfully.");
            return spotify_access_token;
        } catch (error) {
            console.error("Failed to refresh Spotify token:", error);
        }
    };

    async function checkAndRefreshToken() {
        const accessToken = localStorage.getItem('spotify_access_token');
        const refreshToken = localStorage.getItem('spotify_refresh_token');

        if (!accessToken || !refreshToken) {
            console.error("No access or refresh token available.");
            return;
        }

        // If the access token is expired, refresh it.
        if (!isTokenValid(accessToken)) {
            console.log("Spotify access token expired, refreshing...");
            const newAccessToken = await refreshSpotifyToken();
            if (newAccessToken) {
                setSpotifyAccessToken(newAccessToken);
                localStorage.setItem("spotify_access_token", newAccessToken);
            }
        }
    }
    // checkAndRefreshToken();

    const getUserSpotifyProfile = async () => {
        const token = localStorage.getItem('spotify_access_token');

        if (!token) {
            console.error('No access token found.');
            return;
        }

        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSpotifyProfileData(response.data);
            console.log("User details:", response.data)
        } catch (error) {
            console.error('Error fetching user profile', error);
        }
    };



// const getTopTracks = async (authorizationCode) => {
//
//
//     const token = localStorage.getItem('spotify_access_token');
//     const response = await axios.get(`${API_BASE}/me/top/tracks`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             limit: 10,
//         }
//     });
//     console.log(response.data);
// }
// getTopTracks()
//
// const getTopArtists = async (authorizationCode) => {
//     const token = localStorage.getItem('spotify_access_token');
//     const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             limit: 10,
//         }
//     });
//     console.log(response.data)
// }
//
// getTopArtists();

// Fetch user profile from Spotify using the access token



    function handleSpotifyLogout() {
        localStorage.removeItem('spotify_access_token');
        setSpotifyAccessToken(null);
        setSpotifyProfileData(null);
        window.location.reload();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // 1. probeer alle info mee te sturen als put-request,a met aangepast wachtwoord als string [v]
        // 2. Kijk of het nu ook lykt als je e-mail wil veranderen en dan het encrypted wachtwoord meestuurt zoals je
        // 'm had ontvangen

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`,
                {
                    username: username,
                    email: email,
                    password: password, //volgens mij klopt het nu niet, omdat ik als ik niks invul, ik toch de oude
                                        // encrypted JWT string meestuur als nieuw wachtwoord
                    info: info,
                }, {
                    headers: {
                        'Accept': '/*',
                        'Content-Type': 'application/json',
                        'X-API-Key': import.meta.env.VITE_API_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            // setUsername((prevState) => ({...prevState, ...response.data}));
            setEditMode(false);
            console.log("Profile updated:", response);
            // als statuscode 204 dan roep e-mail package aan die email stuurt met bevestiging
        } catch (error) {
            if (error.response) {
                console.error("Error updating profile: " + error.response.data);
            } else {
                console.error("An error occurred while updating the profile.");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleCancelClick() {
        setEditMode(false);
    }




    return (
        <main>
            <OuterContainer type="main">
                <PageContainer>
                    <CardContainer className="profile-greeting">
                        <h2>Hello {isAuth ? user?.username : ''}!</h2>
                        <Button
                            className="sign-out-button"
                            buttonText={loading ? "Signing out.." : "Sign out"}
                            onClick={signOut}
                        >
                            <SignOut size={32}/>
                        </Button>
                    </CardContainer>

                    {/*TODO: This section still needs work, I want to create a log in form with only 2 fields, and a 'register' button that links to the registration page*/}
                    <CardContainer className="account-details-wrapper">
                        <CardTopBar cardName="registration-form" color="secondary">
                            <h3>Account details</h3>
                        </CardTopBar>
                        <form className="form" onSubmit={handleSubmit}>
                            {/*TODO: I want to create logic where you can log in with username or e-mail*/}
                            <InputField
                                type="text"
                                id="username"
                                className="form-input"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                disabled={!editMode}
                            />
                            <InputField
                                type="text"
                                id="email"
                                className="form-input"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                disabled={!editMode}
                            />
                            <p>Click 'Edit' to change password.</p>
                            {editMode &&
                                <>
                                    <InputField
                                        type="password"
                                        id="password"
                                        className="form-input"
                                        placeholder="New Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </>
                            }

                            <div className="login-form-button-container">
                                {!editMode &&
                                    <Button
                                        buttonText="Edit"
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => setEditMode(true)}
                                    />
                                }
                                {editMode &&
                                    <>
                                        <Button
                                            buttonText="Cancel"
                                            type="button"
                                            className="secondary-button"
                                            onClick={handleCancelClick}
                                            disabled={loading}
                                        />
                                        <Button
                                            buttonText="Save"
                                            type="submit"
                                            className="secondary-button"
                                            onClick={() => !editMode && setEditMode(false)}
                                            disabled={loading}
                                        />
                                    </>
                                }

                                {/*TODO button logic that if it says EDIT, when you click it, the fields above become adaptable, then the buttons: SAVE appears, when SAVE is clicked, the information that was entered will be changed to the profile data. */}
                            </div>
                        </form>
                    </CardContainer>
                    {/*TODO: Logic for displaying all playlist names and descriptions?*/}
                    <CardContainer className="card--my-playlists-wrapper">
                        <CardTopBar cardName="my-playlists" color="primary">
                            <h3>My playlists</h3>
                            {/*TODO: When clicked, you go to page: my playlists where you can edit the playlists*/}
                            <Button
                                type="button"
                                className="button--edit-my-playlists"
                                buttonText="Edit"
                            >
                                <Pencil size={24}/>
                            </Button>
                        </CardTopBar>
                        <div className="card--my-playlists">
                            <div className="my-playlists">
                                <p>List of playlists will be displayed here with clickable links</p>
                            </div>
                        </div>
                    </CardContainer>

                    {/*TODO: This section appears when spotify account is not yet connected*/}

                    <CardContainer
                        className="connect-spotify"
                    >
                        {/* If the user is authenticated */}
                        {spotifyAccessToken && spotifyProfileData ? (
                            <div>
                                <h2>Spotify profile {spotifyProfileData.display_name}</h2>
                                {spotifyProfileData.images > 0 && <img src={spotifyProfileData.images[0]?.url} alt="User Avatar"/>}
                                <p>Followers: {spotifyProfileData.followers.total}</p>
                                <Button
                                    type="button"
                                    buttonText="Spotify account log out"
                                    onClick={handleSpotifyLogout}
                                />
                            </div>
                        ) : (
                            <div>
                                <div className="spotify-img-wrapper">
                                    <img src={spotifyLogo} alt="spotify-logo"/>
                                </div>
                                <p>Connect your Spotify account to your profile and import your playlists directly to
                                    Spotify</p>
                                <Button
                                    buttonText="Connect spotify"
                                    type="button"
                                    onClick={redirectToSpotifyAuth}
                                />
                            </div>
                        )}
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}

export default Profile;