import React, {useContext, useEffect, useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {MagnifyingGlass, Funnel, CheckCircle, XCircle, SignOut} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import {useNavigate} from 'react-router-dom';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';

export default function Home() {
    // For sign in functionality
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    // For music functionalities
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Context
    const {isAuth, signIn, signOut, user} = useContext(AuthContext);

    useEffect(() => {
        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({grant_type: 'client_credentials'}), // Correctly formatted form data
                    {
                        headers: {
                            'Authorization': `Basic ${authString}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                console.log(response.data); //logs the access_token
                localStorage.setItem("spotifyToken", response.data["access_token"]);
            } catch (e) {
                console.error(e);
            }
        }

        fetchToken();

        async function getUser() {
            try {
                const result = await axios.get(`${NOVI_PLAYGROUND_BACKEND}users/${username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(result.data);
            } catch (e) {
                console.error("Error fetching user:", e);
            }
        }

        getUser()
    }, []);

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError(false);
        toggleLoading(true);

        try {
            const result = await axios.post(`${NOVI_PLAYGROUND_BACKEND}users/authenticate`, {
                username: username,
                password: password
            });
            console.log(result.data);
            signIn(result.data.jwt);
        } catch (e) {
            if (e.response && e.response.status === 400) {
                setError("User not found:");
            } else {
                setError("Something went wrong. Please try again later.")
            }
        } finally {
            toggleLoading(false);
        }
    }

    // TODO: Consider removing the CardContainer classnames, as I don't use them for css (yet)?

    return (
        <main>
            <OuterContainer type="main">
                <PageContainer>
                    <CardContainer>
                        <CardTopBar cardName="introduction" color="primary">
                            <h2>Hello {isAuth ? user?.username : 'world'}!</h2>
                            {isAuth &&
                                <Button
                                className="sign-out-button"
                                buttonText={loading ? "Signing out.." : "Sign out"}
                                onClick={signOut}>
                                <SignOut size={32} />
                            </Button>
                            }
                        </CardTopBar>
                        <div className="introduction">
                            <p>Welcome to PLAYGROUND! I have created this page for people that are always looking for
                                new music to expand their collection with.</p>
                            <p>Play around, tell us what you like, listen to the
                                song selection and add them to your own personal library.</p>
                        </div>
                    </CardContainer>

                    {/*TODO: This section appears when user is logged in*/}
                    {isAuth ?
                        <CardContainer className="connect-spotify">
                            <div className="spotify-img-wrapper">
                                <img src={spotifyLogo} alt="spotify-logo"/>
                            </div>
                            <p>Connect your Spotify account to your profile and import your playlists directly to
                                Spotify</p>
                        </CardContainer>
                        :
                        <CardContainer className="login-account">
                            <CardTopBar color="secondary">
                                <h3>Log in to your account to save your playlists</h3>
                            </CardTopBar>
                            <form className="form" onSubmit={handleLoginSubmit}>
                                {/*TODO: I want to create logic where you can log in with username or e-mail*/}

                                <InputField
                                    type="text"
                                    id="username-field"
                                    name="username"
                                    value={username}
                                    className="form-input"
                                    placeholder="Name"
                                    required={true}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <InputField
                                    type="password"
                                    id="password-field"
                                    name="password"
                                    value={password}
                                    className="form-input"
                                    placeholder="Password"
                                    required={true}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/*{error && <p>{error}</p>}*/}
                                {/*TODO: Check if error message works as soon as log out function is working*/}
                                <div className="form-button-container">
                                    <Button
                                        buttonText="Log in"
                                        type="submit"
                                        className="secondary-button"
                                    />
                                    <Button
                                        buttonText="Register"
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => navigate("/registration")}
                                    />
                                </div>
                            </form>
                        </CardContainer>
                    }

                    {/*TODO: Consideration: only one is visible, first a selection tool for one or the other? Artist or Genre*/}
                    <CardContainer className="genre-selection-wrapper">
                        <CardTopBar
                            cardName="genre-selection" color="secondary">
                            {/*TODO: when clicked the magnifying glass, the search will execute based on the input, the input will stay visible*/}
                            <Button type="button" className="search-button--genre">
                                <MagnifyingGlass size={32} className="search-icon-genre"/>
                            </Button>
                            <h3>Select your favorite genres</h3>
                            {/*TODO: When clicked a pop up screen will appear with a search bar to look for specific genre group, and to type in a specific genre and clickable buttons, when clicked, the genre is automatically are added to the list that is displayed on the home screen, and added to a momentary array, until deleted (maybe a current search array that is default empty) */}
                            <Button
                                type="button"
                                className="genre-selection-button"
                                buttonText="More"
                            >
                                <Funnel size={24}/>
                            </Button>
                        </CardTopBar>
                        <div className="genre-selection">
                            <Button
                                className="selected-genre"
                                buttonText="Genre1"
                                hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                            />
                            <Button
                                className="selected-genre"
                                buttonText="Genre2"
                                hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                            />
                            {/*TODO: add a button element that when clicked it will clear the whole selection.*/}
                        </div>
                    </CardContainer>

                    <CardContainer className="artist-selection-wrapper">
                        <CardTopBar cardName="artist-selection" color="light">
                            <h3>What is the name of your favorite artist?</h3>
                        </CardTopBar>
                        <div className="artist-selection">
                            <form>
                                <Button type="submit" className="search-button--genre">
                                    <MagnifyingGlass size={32} className="search-icon-genre"/>
                                </Button>
                                <InputField
                                    type="text"
                                    id="artistName"
                                    className="artist-selection-input"
                                    placeholder="Artist Name"
                                    required={true}
                                />
                            </form>
                        </div>
                    </CardContainer>

                    {/*TODO: Visible after giving input through Genre or Artist*/}
                    <CardContainer className="music-suggestions-wrapper">
                        <CardTopBar cardName="music-suggestions" color="primary">
                            <h3>Music suggestions based on your picks</h3>
                        </CardTopBar>
                        <div className="music-suggestions">
                            <div className="music-suggestions-playlist">
                                <p>List of music suggestions will be generated here with clickable links</p>
                            </div>
                        </div>
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}