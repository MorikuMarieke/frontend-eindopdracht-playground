import React, {useContext, useEffect, useState} from 'react';
import './Profile.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {HandPointing, House, Pencil, SignOut, Star} from '@phosphor-icons/react';
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
    const [error, setError] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [successfulProfileUpdate, toggleSuccessfulProfileUpdate] = useState(false);

    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [selectedTrackId, setSelectedTrackId] = useState(null);

    const {isAuth, user, signOut, playlistFullData} = useContext(AuthContext);
    const {
        spotifyAccessToken, spotifyProfileData, redirectToSpotifyAuth, handleSpotifyLogout,
    } = useContext(SpotifyContext);

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
            } catch (e) {
                console.error(e);
                setError('Error fetching user data.')
            }
        }

        getUserData();
    }, []);

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

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`, {
                username: username,
                email: email,
                password: password,
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
            toggleSuccessfulProfileUpdate(true);
            setTimeout(() => toggleSuccessfulProfileUpdate(false), 5000);
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

    // TODO: edit to change password is UGLYYYY

    return (
        <main>
            <OuterContainer type="main">
                <PageContainer>
                    <CardContainer className="profile-greeting">
                        <h2>Hello {isAuth ? user?.username : ''}!</h2>
                        <div className="profile-greeting-message">
                            <h3>Welcome to your profile page!</h3>
                            <Button
                                className="sign-out-button"
                                buttonText={loading ? "Signing out.." : "Sign out"}
                                onClick={signOut}
                            >
                                <SignOut size={32}/>
                            </Button>
                        </div>
                    </CardContainer>

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
                            {successfulProfileUpdate && <p>Profile updated successfully!</p>}

                            <div className="login-form-button-container">
                                {!editMode && <Button
                                    buttonText="Edit profile data or password"
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        setEditMode(true);
                                        toggleSuccessfulProfileUpdate(false)
                                    }}
                                >
                                    <Pencil size={24}/>
                                </Button>}
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
                            </div>
                        </form>
                    </CardContainer>

                    {topTracks.length > 0 &&
                        <CardContainer>
                            <CardTopBar color="light">
                                <h3>Your 10 top tracks on Spotify</h3>
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
                                            <Button
                                                className="user-top-track-name"
                                                type="button"
                                                onClick={() => handleTrackClick(track.id)}>
                                                <Rank color="light" index={index}/>
                                                <h4>{track.name}</h4>
                                            </Button>
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
                                <h3>Your 10 top artists on Spotify</h3>
                            </CardTopBar>
                            <ul className="user-top-artists-list">
                                {topArtists && topArtists.map((artist, index) => (
                                    <li key={artist.id}>
                                        <Link to={`/artist/${artist.id}`}>
                                            <article className="top-artist-card">
                                                <div className="top-artist-img-wrapper">
                                                    <img src={artist.images[0].url} alt={`${artist.name}-image`}/>
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

                    {/*TODO: This section appears when spotify account is not yet connected*/}
                    <CardContainer
                        className="connect-spotify-profile"
                    >
                        {spotifyAccessToken && spotifyProfileData ?
                            <>
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
                            </> :
                            <section className="log-in-spotify">
                                <p>Connect your Spotify account to see your current top tracks and top artists.</p>
                                <Button
                                    className="connect-spotify-button"
                                    buttonText="Connect spotify"
                                    type="button"
                                    onClick={redirectToSpotifyAuth}
                                >
                                    <div className="spotify-img-wrapper-profile">
                                        <img src={spotifyLogo} alt="spotify-logo"/>
                                    </div>
                                </Button>
                            </section>
                        }
                    </CardContainer>

                    {/*TODO: Logic for displaying all playlist names and descriptions?*/}
                    <CardContainer className="card--my-playlists-wrapper">
                        <Link to={`/playlist-overview`}>
                            <CardTopBar cardName="my-playlists" color="primary">
                                <div className="link-to-my-playlists">
                                    <Star size={30} weight="fill"/>
                                    <h3> Go to my saved playlists</h3>
                                </div>
                            </CardTopBar>
                        </Link>
                        <div className="card--my-playlists">
                            <ul className="my-playlists">
                                {playlistFullData && playlistFullData.length > 0 ?
                                    playlistFullData.map((playlist) => (
                                        <li key={playlist.id}>{playlist.name}</li>
                                    )) : <>
                                        <p>You have not saved any playlists yet. Go to the home-page to check out
                                            playlists.</p>
                                        <Button
                                            type="button"
                                            className="light-button to-home-page"
                                            buttonText="Go to home-page"
                                        >
                                            <House size={24}/>
                                        </Button>
                                    </>
                                }
                            </ul>
                        </div>
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>)
}

export default Profile;