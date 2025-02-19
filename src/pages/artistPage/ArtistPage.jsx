import React, {useEffect, useState} from 'react';
import './ArtistPage.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';
import {useNavigate, useParams} from 'react-router-dom';
import '../../constants/genreArray.js'
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import ArtistInfoCard from '../../components/artistInfoCard/ArtistInfoCard.jsx';
import RadioPlayer from '../../components/radioPlayer/RadioPlayer.jsx';
import log from 'eslint-plugin-react/lib/util/log.js';

function ArtistPage() {
    const {id} = useParams();
    const [artistDetails, setArtistDetails] = useState({});
    const [artistTopTracks, setArtistTopTracks] = useState([]);
    // const [playlistUrl, setPlaylistUrl] = useState('');
    const [token, setToken] = useState(null);  // Track the token state
    const [playlistUrl, setPlaylistUrl] = useState('');

    const navigate = useNavigate();

    // Step 1: Fetch token
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
                setToken(response.data.access_token);  // Update token state
            } catch (e) {
                console.error("Error fetching token:", e);
            }
        }

        const storedToken = localStorage.getItem("spotifyToken");
        if (storedToken) {
            setToken(storedToken);  // Set token if it's already in localStorage
        } else {
            fetchToken();  // Otherwise, fetch the token
        }
    }, []);

    // Step 2: Fetch artist details once the token is available
    useEffect(() => {
        if (!token) return;  // Wait for token to be available

        async function fetchArtist() {
            try {
                const response = await axios.get(`${API_BASE}/artists/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                });
                setArtistDetails(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching artist details:", error);
            }
        }

        async function fetchArtistTopTracks() {
            try {
                const response = await axios.get(`${API_BASE}/artists/${id}/top-tracks`, {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                });
                setArtistTopTracks(response.data.tracks);
                const trackUris = response.data.tracks.slice(0, 10).map(track => track.id);
                console.log(trackUris)// Get URIs for top 10 tracks
                // setPlaylistUrl( `https://open.spotify.com/embed/track/${trackUris.join(',')}`);
                console.log(response.data.tracks);
                setPlaylistUrl(trackUris)
            } catch (e) {
                console.error(e);
            }
        }

        fetchArtist();
        fetchArtistTopTracks();

    }, [token, id]);
    //
    // const buildPlaylistUrl = () => {
    //     const trackUris = artistTopTracks.slice(0, 10).map(track => track.uri);  // Get URIs for top 10 tracks
    //     setPlaylistUrl( `https://open.spotify.com/embed/track/${trackUris.join(',')}`);
    // };

    return (
        <main>
            <OuterContainer type="artist-info">
                <PageContainer className="page-artist-info">
                    {artistDetails && artistDetails.name && artistDetails.popularity && artistDetails.followers?.total && (
                        <CardContainer className="artist-info-page-card">
                            <CardTopBar
                                cardName="artist-info"
                                color="secondary"
                            >
                                <h3>{artistDetails.name}</h3>
                            </CardTopBar>
                            <ArtistInfoCard
                                artistId={artistDetails.id}
                                followers={artistDetails.followers?.total}
                                popularity={artistDetails.popularity}
                                imgSrc={artistDetails.images[0].url}
                                imgAlt={`${artistDetails.name} image`}
                            />
                        </CardContainer>
                    )}
                    {/*{artistTopTracks &&*/}
                    {/*<CardContainer className="top-tracks">*/}
                    {/*    <CardTopBar*/}
                    {/*        cardName="top-tracks"*/}
                    {/*        color="primary"*/}
                    {/*    >*/}
                    {/*        <h3>Top tracks</h3>*/}
                    {/*        /!*<div className="playlist">*!/*/}
                    {/*        /!*    {artistTopTracks.length > 0 && (*!/*/}
                    {/*        /!*        <RadioPlayer*!/*/}
                    {/*        /!*            src={playlistUrl}*!/*/}
                    {/*        /!*        />*!/*/}
                    {/*        /!*    )}*!/*/}

                    {/*        /!*</div>*!/*/}
                    {/*    </CardTopBar>*/}
                    {/*</CardContainer>*/}
                    {/*}*/}

                    {/*<RadioPlayer*/}
                    {/*    test={'https://open.spotify.com/embed/track/spotify:track:1rf4SX7dduNbrNnOmupLzi'}*/}

                    {/*    />*/}
                    {playlistUrl && playlistUrl.map((track) => {
                        return (
                        <RadioPlayer
                        src={`https://open.spotify.com/embed/track/${track}`}
                        />)
                    })}
                </PageContainer>
            </OuterContainer>
        </main>
    )
}

export default ArtistPage;