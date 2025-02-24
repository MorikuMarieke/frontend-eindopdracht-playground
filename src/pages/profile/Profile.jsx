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


function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [profileData, setProfileData] = useState(null);


    const {isAuth, user, signOut} = useContext(AuthContext);

    const navigate = useNavigate();

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
            // Exchange the authorization code for access token
            exchangeCodeForAccessToken(authorizationCode);
        } else if (accessToken) {
            // Fetch Spotify user profile if access token is available
            getUserProfile();
        }
    }, [accessToken]);

    // Redirect to Spotify authentication page
    const redirectToSpotifyAuth = () => {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirectUri = 'http://localhost:5173/profile';
        const scope = 'user-top-read user-library-read playlist-modify-public';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;

        window.location.href = authUrl;
    };

    // Exchange authorization code for access token and store tokens
    const exchangeCodeForAccessToken = async (authorizationCode) => {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const redirectUri = 'http://localhost:5173/profile';

        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
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
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            setAccessToken(access_token); // Update state with the access token

            // Optionally, navigate to another page or update UI
            navigate('/profile');
        } catch (error) {
            console.error('Error exchanging authorization code for token:', error);
        }
    };


    const getTopTracks = async (authorizationCode) => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_BASE}/me/top/tracks`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                limit: 10,
            }
        });
        console.log(response.data);
    }

    getTopTracks()
    //
    // const getTopArtists = async (authorizationCode) => {
    //     const token = localStorage.getItem('access_token');
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
    const getUserProfile = async () => {
        const token = localStorage.getItem('access_token');

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

            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching user profile', error);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // 1. probeer alle info mee te sturen als put-request, met aangepast wachtwoord als string [v]
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

    const handleCancelClick = () => {
        setEditMode(false);
    };

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
                    <CardContainer className="connect-spotify">
                        <div className="spotify-img-wrapper">
                            <img src={spotifyLogo} alt="spotify-logo"/>
                        </div>
                        <p>Connect your Spotify account to your profile and import your playlists directly to
                            Spotify</p>
                        <Button
                            buttonText="Connect spotify"
                            type="button"

                        />
                    </CardContainer>
                    <CardContainer
                        className="connect-spotify"
                    >
                        {!accessToken && (
                            <div>
                                <p>Connect your Spotify account to view your profile data.</p>
                                <button onClick={redirectToSpotifyAuth}>Connect with Spotify</button>
                            </div>
                        )}

                        {/* If the user is authenticated */}
                        {accessToken && profileData ? (
                            <div>
                                <h2>Spotify profile: {profileData.display_name}</h2>
                                <img src={profileData.images[0]?.url} alt="User Avatar"/>
                                <p>Email: {profileData.email}</p>
                                <p>Followers: {profileData.followers.total}</p>
                                <Button
                                    type="button"
                                    buttonText="Spotify account log out"
                                    onClick={() => localStorage.removeItem('access_token')}
                                />
                            </div>
                        ) : (
                            <p>Loading profile...</p>
                        )}
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}

export default Profile;