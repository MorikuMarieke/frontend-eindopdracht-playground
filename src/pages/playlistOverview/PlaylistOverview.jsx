import React from 'react';
import './PlaylistOverview.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil} from '@phosphor-icons/react';

function PlaylistOverview() {
    return (
        <>
            <main>
                <OuterContainer type="playlist-overview">
                    <div className="inner-container page-playlist-overview">
                        <section className="my-playlists-wrapper">
                            <CardTopBar cardName="my-playlists">
                                <h3>My playlists</h3>
                                {/*When clicked, you go to page: my playlists where you can edit the playlists*/}
                                <Button
                                    type="button"
                                    className="button--edit-my-playlists"
                                    buttonText="Edit"
                                >
                                    <Pencil size={24}/>
                                </Button>
                            </CardTopBar>
                            <div className="playlist-overview-card-wrapper">
                                <div className="playlist-overview-card">
                                    <p>Clickable link to playlist</p>
                                </div>
                                <div className="playlist-overview-card">
                                    <p>Clickable link to playlist</p>
                                </div>
                                <div className="playlist-overview-card">
                                    <p>Clickable link to playlist</p>
                                </div>
                                <div className="playlist-overview-card">
                                    <p>Clickable link to playlist</p>
                                </div>
                                <div className="playlist-overview-card">
                                    <p>Clickable link to playlist</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </OuterContainer>
            </main>
        </>
    )
}

export default PlaylistOverview;