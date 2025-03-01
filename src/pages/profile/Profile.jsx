import React, {useContext, useEffect, useState} from 'react';
import './Profile.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {HandPointing, Pencil, SignOut} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {SpotifyContext} from '../../context/SpotifyContext.jsx';
import RadioPlayer from '../../components/radioPlayer/RadioPlayer.jsx';
import Rank from '../../components/rank/Rank.jsx';


function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);


    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const {isAuth, user, signOut, favoritePlaylists, removeFavoritePlaylist} = useContext(AuthContext);
    const {
        spotifyAccessToken, spotifyProfileData, redirectToSpotifyAuth, handleSpotifyLogout,
    } = useContext(SpotifyContext);

    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`, {
                    headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                    },
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
                setPassword(response.data.password);
                setInfo(response.data.info);
                // console.log(response);
            } catch (e) {
                console.error(e);
            }
        }

        getUserData();

    }, []);

    // Get top tracks if spotify accesstoken is updated.
    useEffect(() => {
        async function getTopTracks() {
            if (!spotifyAccessToken) return;

            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`${API_BASE}/me/top/tracks`, {
                    headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                    }, params: {
                        limit: 10, time_range: "medium_term"
                    }
                });
                setTopTracks(response.data.items)
                console.log("User top tracks:", response.data)
            } catch (e) {
                console.error(e)
            }
        }

        getTopTracks();
    }, [spotifyAccessToken]);

    // Get top tracks if spotify accesstoken is updated.
    useEffect(() => {
        async function getTopArtists() {
            if (!spotifyAccessToken) return;

            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`${API_BASE}/me/top/artists`, {
                    headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                    }, params: {
                        limit: 10, time_range: "medium_term"
                    }
                });
                setTopArtists(response.data.items)
                console.log("User top artists:", response.data.items)
            } catch (e) {
                console.error(e)
            }
        }

        getTopArtists();
    }, [spotifyAccessToken]);

    const handleTrackClick = (trackId) => {
        setSelectedTrackId(selectedTrackId === trackId ? null : trackId);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // 1. probeer alle info mee te sturen als put-request,a met aangepast wachtwoord als string [v]
        // 2. Kijk of het nu ook lykt als je e-mail wil veranderen en dan het encrypted wachtwoord meestuurt zoals je
        // 'm had ontvangen

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`, {
                username: username, email: email, password: password, //volgens mij klopt het nu niet, omdat ik als ik
                                                                      // niks invul, ik toch de oude encrypted JWT
                                                                      // string meestuur als nieuw wachtwoord
                info: info,
            }, {
                headers: {
                    'Accept': '/*',
                    'Content-Type': 'application/json',
                    'X-API-Key': import.meta.env.VITE_API_KEY,
                    'Authorization': `Bearer ${token}`,
                },
            });
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


    return (<main>
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
                        {editMode && <>
                            <InputField
                                type="password"
                                id="password"
                                className="form-input"
                                placeholder="New Password"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!editMode}
                            />
                        </>}

                        <div className="login-form-button-container">
                            {!editMode && <Button
                                buttonText="Edit"
                                type="button"
                                className="secondary-button"
                                onClick={() => setEditMode(true)}
                            />}
                            {editMode && <>
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
                            </>}

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
                    className="connect-spotify-profile"
                >
                    {spotifyAccessToken && spotifyProfileData ? (<>
                        <CardTopBar color="secondary">
                            <h3>Spotify profile</h3>
                        </CardTopBar>
                        <div className="spotify-user-info">
                            <div>
                                <p>Username: {spotifyProfileData.display_name}</p>
                                {spotifyProfileData.images > 0 &&
                                    <img src={spotifyProfileData.images[0]?.url} alt="User Avatar"/>}
                                <p>Followers: {spotifyProfileData.followers.total}</p>
                            </div>
                            <Button
                                type="button"
                                className="spotify-log-out-button"
                                buttonText="Log out"
                                onClick={handleSpotifyLogout}
                            >
                                <div className="spotify-img-wrapper-profile">
                                    <img src={spotifyLogo} alt="spotify-logo"/>
                                </div>
                            </Button>
                        </div>
                    </>) : (<div className="spotify-user-info">
                        <div className="spotify-img-wrapper-profile">
                            <img src={spotifyLogo} alt="spotify-logo"/>
                        </div>
                        <p>Connect your Spotify account to see your current top tracks and top artists.</p>
                        <Button
                            buttonText="Connect spotify"
                            type="button"
                            onClick={redirectToSpotifyAuth}
                        />
                    </div>)}
                </CardContainer>

                {topTracks.length > 0 &&
                    <CardContainer>
                        <CardTopBar color="light">
                            <h3>Your 10 top tracks</h3>
                        </CardTopBar>
                        <ul className="user-top-track-list">
                            <div className="user-advice-tracks">
                                <HandPointing size={40} className="pointer-icon"/>
                                <p>Click on the <em>song name</em> to listen to the track, or click on the <em>artist
                                    name</em> to check out their page!</p>
                            </div>
                            {topTracks && topTracks.map((track, index) => (
                                <li className="user-top-track-list-item" key={track.id}>
                                    <div className="user-top-track-item">
                                        <div className="user-top-track-name" onClick={() => handleTrackClick(track.id)}>
                                            <Rank color="light" index={index}/>
                                            <h4>{track.name}</h4>
                                        </div>
                                        <div className="user-top-track-artists">
                                            <p>
                                                {track.artists.map((artist, index) => (
                                                    <span key={artist.id}>
                                                    <Link to={`/artist/${artist.id}`} className="artist-page-link">
                                                        {artist.name}
                                                    </Link>
                                                        {index < track.artists.length - 1 && ", "}
                                                </span>))}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedTrackId === track.id && (
                                        <div className="spotify-player-user-profile">
                                            <RadioPlayer
                                                src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
                                                height="80"
                                            />
                                        </div>
                                    )}
                                </li>))}
                        </ul>
                    </CardContainer>
                }
                {topArtists.length > 0 &&
                    <CardContainer>
                        <CardTopBar color="primary">
                            <h3>Your 10 top artists</h3>
                        </CardTopBar>
                        <ul className="user-top-artists-list">
                            {topArtists && topArtists.map((artist, index) => (
                                <li key={artist.id}>
                                    <Link to={`/artist/${artist.id}`}>
                                        <article className="top-artist-card">
                                            <div>
                                                <div className="top-artist-img-wrapper">
                                                    <img src={artist.images[0].url} alt={`${artist.name}-image`}/>
                                                </div>
                                            </div>
                                            <h4>{artist.name}</h4>
                                            <Rank color="primary" index={index}/>
                                        </article>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContainer>
                }
            </PageContainer>
        </OuterContainer>
    </main>)
}

export default Profile;