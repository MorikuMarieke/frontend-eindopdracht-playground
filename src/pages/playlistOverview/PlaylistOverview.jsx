import React, {useContext, useEffect, useState} from 'react';
import './PlaylistOverview.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil, Heart, HeartBreak, Trash} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';
import {Link} from 'react-router-dom';

function PlaylistOverview() {


    return (
        <>
        <main>
            <OuterContainer>
                <PageContainer className="page-playlist-overview">
                    <CardContainer className="my-playlists-wrapper">
                        <CardTopBar cardName="my-playlists" color="primary">
                            <h3>My saved playlists</h3>
                            <Button
                                type="button"
                                className="button--edit-my-playlists"
                                buttonText="Edit"
                            >
                                <Pencil size={24}/>
                            </Button>
                        </CardTopBar>
                        <ul className="playlist-overview-card-wrapper">

                    </ul>
                </CardContainer>
            </PageContainer>
        </OuterContainer>
        </main>
</>
)
}

export default PlaylistOverview;