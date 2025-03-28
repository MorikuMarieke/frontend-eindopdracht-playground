import React, {useContext, useEffect, useState} from 'react';
import './Playlist.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {ArrowArcLeft, ListHeart} from '@phosphor-icons/react';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';
import {useNavigate, useParams} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext.jsx';
import DOMPurify from "dompurify";
import RadioPlayer from '../../components/radioPlayer/RadioPlayer.jsx';
import FavoriteIcon from '../../components/favoriteIcon/FavoriteIcon.jsx';

function Playlist() {
    const {id} = useParams();
    const [token, setToken] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [error, setError] = useState('')

    const {isAuth, favoritePlaylists} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    new URLSearchParams({grant_type: "client_credentials"}),
                    {
                        headers: {
                            Authorization: `Basic ${authString}`,
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                localStorage.setItem("spotifyToken", response.data.access_token);
                setToken(response.data.access_token);
            } catch (e) {
                setError("Failed to authenticate with Spotify. Please try again later.");
                console.error("Error fetching token:", e);
            }
        }

        const storedToken = localStorage.getItem("spotifyToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            fetchToken();
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        async function fetchPlaylist() {
            try {
                const response = await axios.get(`${API_BASE}/playlists/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                });
                setPlaylist(response.data);
                console.log(response.data);
            } catch (error) {
                setError("Failed to load playlist. Please check your connection and try again.");
                console.error("Error fetching artist details:", error);
            }
        }

        fetchPlaylist();

    }, [token, id]);

    console.log("DOMPurify:", DOMPurify)

    return (
        <>
            <main>
                <OuterContainer type="playlist">
                    <PageContainer className="page-playlist">
                        <CardContainer className="playlists-wrapper">
                            <CardTopBar cardName="playlist" color="secondary">
                                <h3>Playlist: {playlist?.name || 'Error fetching playlist name'}</h3>
                                <div className="button-container">

                                    <Button
                                        type="button"
                                        className="playlist-button"
                                        buttonText="Home"
                                        onClick={() => navigate("/")}
                                    >
                                        <ArrowArcLeft size={24}/>
                                    </Button>
                                    {isAuth && <Button
                                        type="button"
                                        className="playlist-button"
                                        buttonText="Playlists"
                                        onClick={() => navigate("/playlist-overview")}
                                    >
                                        <ListHeart size={24}/>
                                    </Button>}
                                </div>
                            </CardTopBar>
                            {error &&
                                <div className="playlist-container">
                                    <p>{error}</p>
                                </div>
                            }
                            {playlist ?
                                <div className="playlist-container">
                                    {playlist && playlist.description &&
                                        <div className="playlist-description">
                                            <h3>Playlist description</h3>
                                            <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(playlist.description)}}/>
                                        </div>
                                    }
                                    <div className="favorite-container">
                                        {isAuth && <FavoriteIcon
                                            playlistId={playlist.id}
                                            size={42}
                                        />}
                                        {isAuth && !favoritePlaylists.includes(playlist.id) &&
                                            <h3>Save to favorites</h3>}
                                    </div>

                                    <div className="playlist-background">
                                        <RadioPlayer
                                            src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
                                            height="800"/>
                                    </div>
                                </div>
                                :
                                <div className="playlist-container">
                                    !error && <p>Loading playlist...</p>
                                </div>}
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>
    )
}

export default Playlist;