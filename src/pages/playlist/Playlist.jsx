import React, {useContext, useEffect, useState} from 'react';
import './Playlist.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {ArrowArcLeft, Heart, Radio, Trash} from '@phosphor-icons/react';
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

    const {addFavoritePlaylist, removeFavoritePlaylist, favoritePlaylists} = useContext(AuthContext);

    const navigate = useNavigate();


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
                                <h3>Playlist: {playlist.name}</h3>

                                <Button
                                    type="button"
                                    className="playlist-button"
                                    buttonText="Home"
                                    onClick={() => navigate("/")}
                                >
                                    <ArrowArcLeft size={24}/>
                                </Button>
                            </CardTopBar>
                            <div className="playlist-container">
                                {playlist && playlist.description &&
                                    <div className="playlist-description">
                                        <h3>Playlist description</h3>
                                        <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(playlist.description)}}/>
                                    </div>
                                }
                                {/*{favoritePlaylists && favoritePlaylists.includes(playlist.id) ?*/}
                                {/*    <Button*/}
                                {/*        className="light-button"*/}
                                {/*        buttonText="Remove from favorites"*/}
                                {/*        onClick={() => removeFavoritePlaylist(playlist.id)}*/}
                                {/*    >*/}
                                {/*        <Trash size={24}/>*/}
                                {/*    </Button>*/}
                                {/*    :*/}
                                {/*    <Button*/}
                                {/*        className="light-button"*/}
                                {/*        buttonText="Add to favorites"*/}
                                {/*        onClick={() => addFavoritePlaylist(playlist.id)}*/}
                                {/*    >*/}
                                {/*        <Heart size={24} weight="fill"/>*/}
                                {/*    </Button>*/}
                                {/*}*/}
                                <div className="favorite-container">
                                <FavoriteIcon
                                    playlistId={playlist.id}
                                    size={42}
                                />
                                    {!favoritePlaylists.includes(playlist.id) && <h3>Save to favorites</h3>}
                                </div>

                                <div className="playlist-background">
                                    <RadioPlayer
                                        src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
                                        height="800"/>
                                </div>
                            </div>
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>

        //     TODO: Working currently on creating add playlist to favorite feature, there are still issues.
    )
}

export default Playlist;