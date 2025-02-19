import React, {useContext, useEffect, useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {CheckCircle, Funnel, MagnifyingGlass, SignOut, UserCircle, XCircle} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import {useNavigate} from 'react-router-dom';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE, NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import {genres} from '../../constants/genreArray.js';
import ArtistInfoCard from '../../components/artistInfoCard/ArtistInfoCard.jsx';
import log from 'eslint-plugin-react/lib/util/log.js';

export default function Home() {
    // For sign in functionality
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, toggleLoading] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    // const [playlists, setPlaylists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [artistName, setArtistName] = useState('');
    const [artistId, setArtistId] = useState('');
    const [artistDetails, setArtistDetails] = useState([])

    // For music functionalities
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    // Context
    const {isAuth, signIn, signOut, user} = useContext(AuthContext);

    useEffect(() => {
        // console.log("genres:", genres);

        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({grant_type: 'client_credentials'}), // Correctly
                    // formatted form
                    // data
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

        function getSelectedCategoriesFromStorage() {
            const storedData = localStorage.getItem("selectedCategories");

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                console.log("Stored Categories from parsedData:", parsedData);  // Check if it's as expected
                setSelectedCategories(parsedData);
            }
        }

        getSelectedCategoriesFromStorage();

        function getSelectedGenresFromStorage() {
            const storedData = localStorage.getItem("selectedGenres");

            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    // console.log("Stored genres from parsedData:", parsedData);  // Check if it's as expected
                    setSelectedGenres(parsedData);
                } catch (e) {
                    console.error("Error parsing selectedGenres from LocalStorage:", e);
                }
            }
        }

        getSelectedGenresFromStorage();

    }, []);

    useEffect(() => {
        if (artistId) {
            getArtistInfo(artistId);  // Fetch artist info when artistId is updated
        }
    }, [artistId]);  // Runs every time artistId changes

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
            // console.log(result.data);
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

    async function fetchPlaylistsByCategory(genre) {
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`,
                }, params: {
                    q: genre,  // Genre as a keyword
                    type: 'playlist',  // Searching for playlists
                    limit: 50,  // Limit the number of results
                },
            });
            console.log(response.data.playlists.items);  // Log the playlists
            // You can set the playlists state if needed
            // setPlaylists(response.data.playlists.items);
        } catch (e) {
            console.error('Error fetching playlists by genre', e.response || e);
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

    async function handlePlaylistByCategoryClick() {
        setSelectedCategories(localStorage.getItem())
    }

    async function handleArtistSearchByGenreClick() {
        if (selectedGenres.length === 0) {
            console.warn("No genres selected!");
            return;
        }

        const genreString = selectedGenres.map(genre => genre.name).join(" ");
        console.log("Searching artists with genres:", genreString)
        await fetchArtistsByGenre(genreString);
        // setSelectedGenres(localStorage.getItem("selectedGenres"));

    }

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

    // Example function by Nova

    async function searchItem() {
        try {
            const response = await axios.get(`${API_BASE}/search`, {
                params: {
                    q: 'bob marley', type: 'artist',
                }, headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('spotifyToken'),
                }
            });
            console.log(response.data);
        } catch (e) {
            console.error(e);
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
        {/*    onClick={() => searchItem()}*/}
        {/*>*/}
        {/*    Get item*/}
        {/*</Button>*/}
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
                        <p>Welcome to PLAYGROUND! I have created this page for people that are always looking for
                            new music to expand their collection with.</p>
                        <p>Play around, tell us what you like, listen to the
                            song selection and add them to your own personal library.</p>
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


                {/*TODO: Consideration: only one is visible, first a selection tool for one or the other? Artist or Genre*/}
                <CardContainer className="category-selection-wrapper">
                    <CardTopBar
                        cardName="category-selection" color="secondary">
                        {/*TODO: when clicked the magnifying glass, the search will execute based on the input, the input will stay visible*/}
                        <Button
                            className="search-button--category"
                            type="button"
                            onClick={() => fetchPlaylistsByCategory("discover")}
                        >
                            <MagnifyingGlass size={32} className="search-icon-category"/>
                        </Button>
                        <h3>Select your favorite categories</h3>
                        {/*TODO: When clicked a pop up screen will appear with a search bar to look for specific category group, and to type in a specific category and clickable buttons, when clicked, the category is automatically are added to the list that is displayed on the home screen, and added to a momentary array, until deleted (maybe a current search array that is default empty) */}
                        <Button
                            type="button"
                            className="category-selection-button"
                            buttonText="Select"
                            onClick={() => navigate("/category-selection")}

                        >
                            <Funnel size={24}/>
                        </Button>
                    </CardTopBar>
                    <div className="selected-categories-display">
                        {selectedCategories ? <h3>You have selected the
                                following {(selectedCategories?.length === 1) ? "category" : "categories"}</h3> :
                            <h3>No selected categories yet</h3>}
                        {(selectedCategories.length > 0) && <ul className="selected-categories-list">
                            {selectedCategories.map((category) => (<li key={category.id}>
                                <Button
                                    className="selected-category"
                                    buttonText={category.name}
                                    type="button"
                                />
                            </li>))}
                        </ul>}
                    </div>
                    {/*TODO: add a button element that when clicked it will clear the whole selection.*/}
                </CardContainer>

                <CardContainer className="category-selection-wrapper">
                    <CardTopBar
                        cardName="category-selection" color="secondary">
                        {/*TODO: when clicked the magnifying glass, the search will execute based on the input, the input will stay visible*/}
                        <Button
                            className="search-button--category"
                            type="button"
                            onClick={() => handleArtistSearchByGenreClick()}
                        >
                            <MagnifyingGlass size={32} className="search-icon-category"/>
                        </Button>
                        <h3>Select your favorite genres</h3>
                        {/*TODO: When clicked a pop up screen will appear with a search bar to look for specific category group, and to type in a specific category and clickable buttons, when clicked, the category is automatically are added to the list that is displayed on the home screen, and added to a momentary array, until deleted (maybe a current search array that is default empty) */}
                        <Button
                            type="button"
                            className="category-selection-button"
                            buttonText="Select"
                            onClick={() => navigate("/genre-selection")}

                        >
                            <Funnel size={24}/>
                        </Button>
                    </CardTopBar>
                    <div className="selected-categories-display">
                        {selectedGenres ? <h3>You have selected the
                                following {(selectedGenres?.length === 1) ? "genre" : "genres"}</h3> :
                            <h3>No selected categories yet</h3>}
                        {(selectedGenres.length > 0) && <ul className="selected-categories-list">
                            {selectedGenres.map((genre) => (<li key={genre.id}>
                                <Button
                                    className="selected-category"
                                    buttonText={genre.name}
                                    type="button"
                                />
                            </li>))}
                        </ul>}
                    </div>
                    {/*TODO: add a button element that when clicked it will clear the whole selection.*/}
                </CardContainer>


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
                                className="search-button--category">
                                <MagnifyingGlass size={32} className="search-icon-category"/>
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
                        {artistDetails && artistDetails.name && artistDetails.popularity && artistDetails.followers?.total && (
                            <ArtistInfoCard
                                artistName={artistDetails.name}
                                artistId={artistDetails.id}
                                popularity={artistDetails.popularity}
                                followers={artistDetails.followers?.total}
                                imgSrc={artistDetails.images[0].url}
                                imgAlt={`${artistDetails.name} image`}
                            />
                        )}
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
    </main>)
}




