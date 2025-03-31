import React, {useContext, useEffect, useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {
    CheckCircle,
    Funnel,
    MagnifyingGlass,
    SignOut,
    UserCircle,
    XCircle,
    ArrowFatRight,
    Trash, WarningCircle, Headphones, Heart
} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import {Link, useNavigate} from 'react-router-dom';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import {genres} from '../../constants/genreArray.js';
import {SpotifyContext} from '../../context/SpotifyContext.jsx';
import FavoriteIcon from '../../components/favoriteIcon/FavoriteIcon.jsx';

export default function Home() {
    // For sign in functionality
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);

    // For search by genre
    const [playlistsByGenre, setPlaylistsByGenre] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [playlistSearchDone, togglePlaylistSearchDone] = useState(false);

    // For search by artist name
    const [artistName, setArtistName] = useState('');
    const [artistId, setArtistId] = useState('');
    const [artistDetails, setArtistDetails] = useState([]);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();

    // Context
    const {isAuth, signIn, signOut, user, favoritePlaylists} = useContext(AuthContext);
    const {spotifyProfileData} = useContext(SpotifyContext);

    useEffect(() => {
        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({grant_type: 'client_credentials'}),
                    {
                        headers: {
                            'Authorization': `Basic ${authString}`, 'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                localStorage.setItem('spotifyToken', response.data['access_token']);
            } catch (e) {
                console.error(e);
                setApiError('Error fetching Spotify token.')
            }
        }

        fetchToken();
    }, []);

    useEffect(() => {
        function getSelectedGenresFromStorage() {
            const storedData = localStorage.getItem('selectedGenres');

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setSelectedGenres(parsedData);
                } catch (e) {
                    console.error('Error parsing selectedGenres from LocalStorage:', e);
                }
            }
        }

        getSelectedGenresFromStorage();
    }, []);

    useEffect(() => {
        function retrievePlaylistsFromStorage() {
            const savedPlaylists = localStorage.getItem('genrePlaylistSelection');

            if (savedPlaylists) {
                const parsedData = JSON.parse(savedPlaylists)
                setPlaylistsByGenre(parsedData);
                console.log('Saved playlists:', playlistsByGenre)
                togglePlaylistSearchDone(true);
            } else {
                togglePlaylistSearchDone(false);
            }
        }

        retrievePlaylistsFromStorage();
    }, []);

    useEffect(() => {
        if (artistId) {
            getArtistInfo(artistId);
        }
    }, [artistId]);

    useEffect(() => {
        if (!isAuth) {
            console.log('User logged out. Clearing search results and genres...');
            setPlaylistsByGenre([]);
            setSelectedGenres([]);
            togglePlaylistSearchDone(false);
        }
    }, [isAuth]);

    useEffect(() => {
        async function fetchPlaylistsByGenre() {
            setApiError(null);
            if (!selectedGenres.length) {
                console.log('No genres selected');
                setPlaylistsByGenre([]);
                return;
            }

            console.log('Selected Genres:', selectedGenres);
            togglePlaylistSearchDone(false);

            const genreString = selectedGenres.map(genre => genre.name).join(' ');
            console.log('Searching playlists with genres:', genreString);

            try {
                const response = await axios.get(`${API_BASE}/search`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                    },
                    params: {
                        q: `${encodeURIComponent(genreString)}`,
                        type: 'playlist',
                        limit: 50,
                    },
                });

                if (!response.data.playlists || !response.data.playlists.items) {
                    console.warn('No playlists found for selected genres.');
                    setPlaylistsByGenre([]);
                    setApiError('No playlists found for the selected genres.');
                    return;
                }

                const validPlaylists = (response.data.playlists?.items || []).filter(playlist => playlist !== null);

                const sortedPlaylists = [...validPlaylists].sort((a, b) => {
                    const aName = a.name?.toLowerCase() || '';
                    const bName = b.name?.toLowerCase() || '';

                    const aDesc = a.description?.toLowerCase() || '';
                    const bDesc = b.description?.toLowerCase() || '';

                    const aNameMatch = selectedGenres.reduce((acc, genre) => acc + (aName.includes(genre.name.toLowerCase()) ? 2 : 0), 0);
                    const bNameMatch = selectedGenres.reduce((acc, genre) => acc + (bName.includes(genre.name.toLowerCase()) ? 2 : 0), 0);

                    const aDescMatch = selectedGenres.reduce((acc, genre) => acc + (aDesc.includes(genre.name.toLowerCase()) ? 1 : 0), 0);
                    const bDescMatch = selectedGenres.reduce((acc, genre) => acc + (bDesc.includes(genre.name.toLowerCase()) ? 1 : 0), 0);

                    return (bNameMatch + bDescMatch) - (aNameMatch + aDescMatch);
                });

                setPlaylistsByGenre(sortedPlaylists);
                localStorage.setItem('genrePlaylistSelection', JSON.stringify(sortedPlaylists));

            } catch (e) {
                console.error('Error fetching playlists', e.response || e);

                if (!e.response) {
                    setApiError('Network error. Please check your connection.');
                } else if (e.response.status === 401) {
                    setApiError('Unauthorized. Your Spotify token may have expired. Please reload.');
                } else if (e.response.status === 429) {
                    setApiError('Rate limit exceeded. Try again later.');
                } else {
                    setApiError('Could not fetch playlists. Please try again.');
                }

                setPlaylistsByGenre([]);
            } finally {
                togglePlaylistSearchDone(true);
            }
        }

        fetchPlaylistsByGenre();
    }, [selectedGenres]);

    function deleteSelectedGenres() {
        localStorage.removeItem('selectedGenres');
        setPlaylistsByGenre([]);
        setSelectedGenres([]);
    }

    // Functions related to searching an artist by name
    async function searchArtist(artistName) {
        setApiError(null);
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                params: {
                    q: artistName, type: 'artist',
                }, headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('spotifyToken'),
                }
            });
            console.log(response.data);
            const artist = response.data.artists.items[0];
            if (artist) {
                setArtistId(artist.id);
                setArtistDetails(artist)
                console.log(artist);
            } else {
                setApiError('Could not find artist with matching name.');
            }
        } catch (e) {
            console.error(e);
            setApiError('Could not find artist with matching name.');
        }
    }

    async function getArtistInfo(artistId) {
        setApiError(null);
        try {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                },
            });
            console.log(response.data);
        } catch (e) {
            console.error('Error fetching playlists by genre', e.response || e);
            setApiError('Could not fetch artist information. Please try again.');
        }
    }

    async function handleArtistSubmit(e) {
        e.preventDefault();
        await searchArtist(artistName);
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError(false);
        toggleLoading(true);

        try {
            const result = await axios.post(`${NOVI_PLAYGROUND_BACKEND}/users/authenticate`, {
                username: username, password: password
            });
            signIn(result.data.jwt);
        } catch (err) {
            console.error(err.response)
            if (err.response) {
                if (err.response.status === 400 && err.response.data === 'User not found') {
                    setError('User not found');
                } else if (err.response.status === 401 && err.response.data === 'Invalid username/password') {
                    setError('Wrong password');
                } else {
                    setError('Something went wrong. Please try again later.');
                }
            } else {
                setError('Something went wrong. Please try again later.');
            }
        } finally {
            toggleLoading(false);
        }
    }

    return (
        <main>
            <OuterContainer type="main">
                <PageContainer>
                    <CardContainer>
                        <CardTopBar cardName="introduction" color="primary">
                            <h2>Hello {isAuth ? user?.username : 'world'}!</h2>
                            {isAuth && <Button
                                className="sign-out-button"
                                buttonText={loading ? "Signing out.." : "Sign out"}
                                onClick={signOut}>
                                <SignOut size={32}/>
                            </Button>}
                        </CardTopBar>
                        <div className="introduction">
                            <p>Welcome to the PLAYGROUND home-page! </p>
                            <p>This page was created for those that are always eager to find new
                                music!</p>
                            <p>Play around, tell us what you like, listen to the song selection and add them to your own
                                personal library.</p>
                            {isAuth && <div className="go-to-profile">
                                <Button
                                    className="go-to-profile-button"
                                    buttonText="Go to my profile"
                                    type="button"
                                    onClick={() => navigate("/profile")}
                                >
                                    <UserCircle size={32}/>
                                </Button>
                            </div>}
                        </div>
                    </CardContainer>

                    {apiError &&
                        <CardContainer>
                            <CardTopBar color="primary">
                                <h3>Oopsie. An error occured.</h3>
                            </CardTopBar>
                            <div className="error-message-container">
                                <WarningCircle size={60}/>
                                <p className="error-message">{apiError}</p>
                            </div>
                        </CardContainer>


                    }

                    {/*TODO: This section appears when user is logged in*/}
                    {isAuth && !spotifyProfileData &&
                        <Link to={'/profile'}>
                            <CardContainer className="connect-spotify">
                                <div className="spotify-img-wrapper">
                                    <img src={spotifyLogo} alt="spotify-logo"/>
                                </div>
                                <p>Connect your Spotify account to your profile and import your playlists directly to
                                    Spotify</p>
                            </CardContainer>
                        </Link>
                    }
                    {!isAuth &&
                        <CardContainer>
                            <CardTopBar color="secondary">
                                <h3>Log in to your account to save your playlists</h3>
                            </CardTopBar>
                            <form className="form" onSubmit={handleLoginSubmit}>
                                {/*TODO: Error message to display if name is wrong*/}

                                <InputField
                                    type="text"
                                    id="username-field"
                                    name="username"
                                    value={username}
                                    className="form-input"
                                    placeholder="Name"
                                    required={true}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError('');
                                    }}
                                />
                                <InputField
                                    type="password"
                                    id="password-field"
                                    name="password"
                                    value={password}
                                    className="form-input"
                                    placeholder="Password"
                                    required={true}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                />
                                {error && <p className="error-message">{error}</p>}
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
                        </CardContainer>}

                    <CardContainer>
                        <CardTopBar cardName="artist-selection" color="light">
                            <h3>What is the name of your favorite artist?</h3>
                        </CardTopBar>
                        <div className="artist-selection">
                            <form
                                onSubmit={handleArtistSubmit}
                            >
                                <Button
                                    type="submit"
                                    className="search-icon-button">
                                    <MagnifyingGlass size={32} className="search-icon"/>
                                </Button>
                                <InputField
                                    type="text"
                                    id="artistName"
                                    value={artistName}
                                    className="artist-selection-input"
                                    placeholder="Artist Name"
                                    required={true}
                                    onChange={(e) => setArtistName(e.target.value)}
                                />
                            </form>
                            {artistDetails && artistDetails.name && (
                                <div>
                                    <article className="artist-details-home-page">
                                        {artistName.toLowerCase() !== artistDetails.name.toLowerCase() &&
                                            <h3 className="search-difference">Did you
                                                mean <strong>[ {artistDetails.name} ]</strong> ? If not, try entering a
                                                different artist name. </h3>
                                        }
                                        <div className="artist-img-wrapper">
                                            <img src={artistDetails.images[0]?.url}
                                                 alt={`${artistDetails.name} image`}/>
                                        </div>
                                        <Link to={`/artist/${artistDetails.id}`}>
                                            <div className="artist-info-link">
                                                <h3>Go to {artistDetails.name} artist page</h3>
                                                <ArrowFatRight size={24}/>
                                            </div>
                                        </Link>
                                    </article>
                                </div>
                            )}
                        </div>
                    </CardContainer>

                    <CardContainer>
                        <CardTopBar
                            cardName="genre-selection" color="secondary">
                            <h3>Select your favorite genres to find a playlist that you might like</h3>
                            <Button
                                type="button"
                                className="genre-selection-button"
                                buttonText="Select"
                                onClick={() => navigate("/genre-selection")}
                            >
                                <Funnel size={24}/>
                            </Button>
                        </CardTopBar>
                        <div className="selected-genres-display">
                            {selectedGenres.length > 0 ?
                                <h3>You have selected the
                                    following {(selectedGenres.length === 1) ? "genre" : "genres"}</h3>
                                :
                                <h3>No selected genres yet</h3>}

                            {(selectedGenres.length > 0) &&
                                <ul className="selected-genres-list">
                                    {selectedGenres.map((genre) => (
                                        <li className="selected-genre-list-item" key={genre.id}>
                                            <h3>{genre.name}</h3>
                                        </li>))}
                                </ul>}
                            {selectedGenres.length > 0 &&
                                <Button
                                    className="delete-selected-genres-button"
                                    type="button"
                                    buttonText="Clear selection"
                                    onClick={deleteSelectedGenres}
                                >
                                    <Trash size={24}/>
                                </Button>}
                        </div>
                    </CardContainer>

                    {selectedGenres.length > 0 && playlistSearchDone && (
                        playlistsByGenre.length > 0 ? (
                            <CardContainer>
                                <CardTopBar color="secondary">
                                    <h3>You might want to check out these playlists!</h3>
                                </CardTopBar>
                                <ul className="playlist-list-container">
                                    {playlistsByGenre.slice(0, 10).map((playlist) => (
                                        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                                            <li>
                                                <Button
                                                    className="playlist-list-item"
                                                    type="button"
                                                >
                                                    <div className="playlist-img-wrapper">
                                                        <img className="playlist-img" src={playlist.images[0].url}
                                                             alt="playlist-image"/>
                                                    </div>
                                                    <div className="playlist-info-container">
                                                        <h3>{playlist.name}</h3>
                                                        <h3 className="playlist-hover-text"><Headphones size={24} />Go to playlist</h3>
                                                    </div>
                                                    {favoritePlaylists.includes(playlist.id) &&
                                                        <>
                                                        <Heart className="favorite-heart" size={32} weight="fill" />
                                                        <Heart className="favorite-heart-outline" size={32} />
                                                        </>
                                                }
                                                </Button>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </CardContainer>
                        ) : (
                            <CardContainer>
                                <CardTopBar color="secondary">
                                    <h3>Sorry!</h3>
                                </CardTopBar>
                                <div className="playlist-list-container">
                                    <p>We couldn't find any playlist that fits the search query you entered.</p>
                                </div>
                            </CardContainer>
                        )
                    )}
                </PageContainer>
            </OuterContainer>
        </main>)
}