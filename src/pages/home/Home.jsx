import React, {useContext, useEffect, useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {CheckCircle, Funnel, MagnifyingGlass, SignOut, UserCircle, XCircle, ArrowFatRight} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import {Link, useNavigate} from 'react-router-dom';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import {genres} from '../../constants/genreArray.js';

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

    const navigate = useNavigate();

    // Context
    const {isAuth, signIn, signOut, user} = useContext(AuthContext);

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
                // console.log(response.data); //logs the access_token
                localStorage.setItem("spotifyToken", response.data["access_token"]);
            } catch (e) {
                console.error(e);
            }
        }

        fetchToken();

        function getSelectedGenresFromStorage() {
            const storedData = localStorage.getItem("selectedGenres");

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setSelectedGenres(parsedData);
                } catch (e) {
                    console.error("Error parsing selectedGenres from LocalStorage:", e);
                }
            }
        }

        getSelectedGenresFromStorage();

        function retrievePlaylistsFromStorage() {
            const savedPlaylists = localStorage.getItem('genrePlaylistSelection');

            if (savedPlaylists) {
                const parsedData = JSON.parse(savedPlaylists)
                setPlaylistsByGenre(parsedData);
                console.log("Saved playlists:", playlistsByGenre)
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


    // async function getUser() {
    //     try {
    //         const result = await axios.get(`${NOVI_PLAYGROUND_BACKEND}/users/${user.username}`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         });
    //         console.log("User", result.data);
    //     } catch (e) {
    //         console.error("Error getting user:", e);
    //     }
    // }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError(false);
        toggleLoading(true);

        try {
            const result = await axios.post(`${NOVI_PLAYGROUND_BACKEND}/users/authenticate`, {
                username: username, password: password
            });
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


    async function fetchArtistsByGenre(genreString) {

        console.log(genreString);
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                }, params: {
                    q: `genre:${encodeURIComponent(genreString)}`, type: "artist", limit: 50,
                },
            });
            console.log(response.data);
            // console.log(response.data.artists.name);

            const filteredArtists = response.data.artists.items.filter(artist => artist.genres.some(genre => genre.toLowerCase().includes(genreString.toLowerCase())));
            console.log(filteredArtists);
        } catch (e) {
            console.error("Error fetching artists", e.response || e);
        }
    }


    async function handleArtistSearchByGenreClick() {
        if (selectedGenres.length === 0) {
            console.warn("No genres selected!");
            return;
        }

        const genreString = selectedGenres.map(genre => genre.name).join(" ");
        console.log("Searching artists with genres:", genreString)
        await fetchArtistsByGenre(genreString);
    }


    useEffect(() => {

        async function fetchPlaylistsByGenre() {
            if (!selectedGenres.length) {
                console.log("No genres selected");
                return;
            }

            console.log(selectedGenres)
            togglePlaylistSearchDone(false);

            const genreString = selectedGenres.map(genre => genre.name).join(" ");
            console.log("Searching playlists with genres:", genreString)

            try {
                const response = await axios.get(`${API_BASE}/search`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                    }, params: {
                        q: `${encodeURIComponent(genreString)}`,
                        type: "playlist", limit: 50,
                    },
                });

                if (!response.data.playlists || !response.data.playlists.items) return [];

                const validPlaylists = response.data.playlists.items.filter(playlist => playlist !== null);

                const sortedPlayLists = validPlaylists.sort((a, b) => {
                    const queryLowerCase = genreString.toLowerCase();

                    const aNameMatch = a.name.toLowerCase().includes(queryLowerCase) ? 2 : 0;
                    const bNameMatch = b.name.toLowerCase().includes(queryLowerCase) ? 2 : 0;

                    const aDescMatch = a.description?.toLowerCase().includes(queryLowerCase) ? 1 : 0;
                    const bDescMatch = b.description?.toLowerCase().includes(queryLowerCase) ? 1 : 0;

                    return (bNameMatch + bDescMatch) - (aNameMatch + aDescMatch); // Prioritize name matches first
                });


                console.log("Filtered and sorted playlists:", sortedPlayLists);
                setPlaylistsByGenre(sortedPlayLists);
                localStorage.setItem('genrePlaylistSelection', JSON.stringify(sortedPlayLists));

            } catch (e) {
                console.error("Error fetching playlists", e.response || e);
                togglePlaylistSearchDone(true);
            } finally {
                togglePlaylistSearchDone(true);
            }
        }

        fetchPlaylistsByGenre()
    }, [selectedGenres])


    // const leukeDingen = localStorage.getItem('categories');
    //     console.log(leukeDingen ? JSON.parse(leukeDingen) : 'Staat niks in');

    // TODO: Consider removing the CardContainer classnames, as I don't use them for css (yet)?

    async function getArtistInfo(artistId) {
        try {
            const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                },
            });
            console.log(response.data);
        } catch (e) {
            console.error('Error fetching playlists by genre', e.response || e);
        }
    }

    // Functions related to searching an artist by name

    async function searchArtist(artistName) {
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
                console.log("No artist found!");
            }
        } catch (e) {
            console.error(e);
        }
    }


    async function handleArtistSubmit(e) {
        e.preventDefault();
        await searchArtist(artistName);
    }


    return (<main>
        {/*<Button*/}
        {/*    onClick={() => localStorage.setItem('categories', JSON.stringify(['metal', 'banaan']))}>*/}
        {/*    Doe in de localStorage Bro*/}
        {/*</Button>*/}
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
                        <p>Welcome to PLAYGROUND! This page was created for those that are always eager to find new music!</p>
                        <p>Play around, tell us what you like, listen to the song selection and add them to your own personal library.</p>
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

                {/*TODO: This section appears when user is logged in*/}
                {isAuth ? <CardContainer className="connect-spotify">
                    <div className="spotify-img-wrapper">
                        <img src={spotifyLogo} alt="spotify-logo"/>
                    </div>
                    <p>Connect your Spotify account to your profile and import your playlists directly to
                        Spotify</p>
                </CardContainer> : <CardContainer className="login-account">
                    <CardTopBar color="secondary">
                        <h3>Log in to your account to save your playlists</h3>
                    </CardTopBar>
                    <form className="form" onSubmit={handleLoginSubmit}>
                        {/*TODO: If it's a preselected name, you cannot change the name, why? It does work on reload. Letters are small when unclickable.*/}
                        {/*TODO: Error message to display if name is wrong*/}

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

                <CardContainer className="artist-selection-wrapper">
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

                                    <div className="artist-img-wrapper">
                                        <img src={artistDetails.images[0].url} alt={`${artistDetails.name} image`}/>
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

                <CardContainer className="genre-selection-wrapper">
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
                                {selectedGenres.map((genre) => (<li className="selected-genre-list-item" key={genre.id}>
                                    <h3>{genre.name}</h3>
                                </li>))}
                            </ul>}
                    </div>
                    {/*TODO: add a button element that when clicked it will clear the whole selection.*/}
                </CardContainer>

                {selectedGenres.length > 0 &&
                    playlistSearchDone && (
                        playlistsByGenre.length > 0 ? (
                            <CardContainer>
                                <CardTopBar color="secondary">
                                    <h3>You might want to check out these playlists!</h3>
                                </CardTopBar>
                                <ul className="playlist-list-container">
                                    {playlistsByGenre.slice(0, 10).map((playlist) => (
                                        <Link to={`/playlist/${playlist.id}`}>
                                            <li>

                                                <Button
                                                    className="playlist-list-item"
                                                    type="button"
                                                    buttonText={playlist.name}

                                                >
                                                    <div className="playlist-img-wrapper">
                                                        <img className="playlist-img" src={playlist.images[0].url}
                                                             alt="playlist-image"/>
                                                    </div>
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
                    )
                }
            </PageContainer>
        </OuterContainer>
    </main>)
}