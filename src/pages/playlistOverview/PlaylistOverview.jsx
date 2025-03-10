import React, {useContext, useEffect, useState} from 'react';
import './PlaylistOverview.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil, Trash, Dog, XCircle, House, ArrowArcLeft} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';
import {Link, useNavigate} from 'react-router-dom';

function PlaylistOverview() {
    const [playlistFullData, setPlaylistFullData] = useState([]);
    const [editMode, toggleEditmode] = useState(false);

    const {favoritePlaylists, removeFavoritePlaylist, clearFavoritePlaylists} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            const storedPlaylistIds = JSON.parse(localStorage.getItem("favoritePlaylists")) || [];

            console.log("Fetching Playlists for IDs:", storedPlaylistIds);

            if (storedPlaylistIds.length === 0) {
                setPlaylistFullData([]);
                return;
            }

            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    console.error("No Spotify access token found.");
                    return;
                }

                // Fetch playlist data
                const playlistRequests = storedPlaylistIds.map(id => {
                    console.log(`Fetching playlist ID: ${id}`);
                    return axios.get(`${API_BASE}/playlists/${id}`, {
                        headers: {Authorization: `Bearer ${token}`},
                    });
                });

                const playlistResponses = await Promise.allSettled(playlistRequests);
                console.log("Playlist Responses:", playlistResponses);

                const validPlaylists = playlistResponses
                    .filter(res => res.status === "fulfilled") // Only use successful responses
                    .map(res => res.value.data);
                console.log("valid playlists:", validPlaylists)

                setPlaylistFullData(validPlaylists);

                // Update localStorage to remove invalid playlists
                const validIds = validPlaylists.map(p => p.id);
                localStorage.setItem("favoritePlaylists", JSON.stringify(validIds));

            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, [favoritePlaylists]);

    return (
        <>
            <main>
                <OuterContainer>
                    <PageContainer className="page-playlist-overview">
                        <CardContainer className="my-playlists-wrapper">
                            <CardTopBar cardName="my-playlists" color="primary">
                                <h3>My saved playlists</h3>
                                {playlistFullData.length > 0 && !editMode &&
                                    <Button
                                        type="button"
                                        className="edit-my-playlists-button"
                                        buttonText="Edit"
                                        onClick={() => toggleEditmode(true)}
                                    >
                                        <Pencil size={24}/>
                                    </Button>
                                }
                                {playlistFullData.length > 0 && editMode &&
                                    <Button
                                        type="button"
                                        className="edit-my-playlists-button"
                                        buttonText="Cancel"
                                        onClick={() => toggleEditmode(false)}
                                    >
                                        <XCircle size={24}/>
                                    </Button>
                                }
                                {/*    TODO: started working on finalizing look of this page and implementing editmode.*/}
                            </CardTopBar>
                            {playlistFullData && playlistFullData.length > 0 ?
                                <div className="playlist-overview-card-wrapper">
                                    <ul className="playlist-overview-card-list">
                                        {playlistFullData.length > 0 && playlistFullData.map((playlist) => (
                                                <li className="playlist-favorites-list-item" key={playlist.id}>
                                                    <div className="playlist-favorites-img-wrapper">
                                                        <img src={playlist.images[0].url} alt="playlist-image"/>
                                                    </div>
                                                    <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
                                                        <h3>{playlist.name}</h3>
                                                    </Link>
                                                    <div className="trash-button-container">
                                                        {editMode &&
                                                            <Button
                                                                className="trash-icon-button"
                                                                type="button"
                                                                onClick={() => removeFavoritePlaylist(playlist.id)}
                                                            >
                                                                <Trash size={24}/>
                                                            </Button>}
                                                    </div>
                                                </li>

                                            )
                                        )}
                                    </ul>
                                    {editMode && <Button
                                        type="button"
                                        className="remove-playlists-button"
                                        buttonText="Clear all"
                                        onClick={() => {
                                            clearFavoritePlaylists();
                                            toggleEditmode(false);
                                        }}
                                    >
                                        <Trash size={24}/>
                                    </Button>}
                                </div>
                                :
                                <div className="playlist-overview-card-wrapper-empty">
                                        <h3>Wow, such empty.</h3>
                                        <Dog size={30}/>
                                    <p>Go back to Home-page to find some playlists to save here!
                                    </p>
                                    <Button
                                        className="link-back-home"
                                        buttonText="Home"
                                        onClick={() => navigate(`/`)}
                                    >
                                        <ArrowArcLeft size={24}/>
                                    </Button>

                                </div>
                            }

                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>
    )
}

export default PlaylistOverview;