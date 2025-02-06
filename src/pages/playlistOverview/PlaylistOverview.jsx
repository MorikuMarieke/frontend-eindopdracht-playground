import React from 'react';
import './PlaylistOverview.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';

function PlaylistOverview() {
    return (
        <>
            <main>
                <OuterContainer type="playlist-overview">
                    <PageContainer className="page-playlist-overview">
                        <CardContainer className="my-playlists-wrapper">
                            <CardTopBar cardName="my-playlists" color="primary">
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
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>
    )
}

export default PlaylistOverview;