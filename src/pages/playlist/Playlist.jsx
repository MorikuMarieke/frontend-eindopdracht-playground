import React from 'react';
import './Playlist.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil} from '@phosphor-icons/react';

function Playlist() {
    return (
        <>
            <main>
                <OuterContainer type="playlist">
                    <PageContainer className="page-playlist">
                        <CardContainer className="playlists-wrapper">
                            <CardTopBar cardName="playlist" color="primary">
                                <h3>[Playlist name]</h3>

                                <Button
                                    type="button"
                                    className="button--edit-playlist"
                                    buttonText="Edit"
                                >
                                    <Pencil size={24}/>
                                </Button>
                            </CardTopBar>
                            <div className="playlist-overview-card-wrapper">
                                <div className="playlist-card">
                                    <p>Song with info, map playlist songs</p>
                                </div>
                            </div>
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
            {/*Insert logic for displaying the created playlist. */}
        </>
    )
}

export default Playlist;