import React, {useContext, useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {MagnifyingGlass, Funnel, CheckCircle, XCircle} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import {useNavigate} from 'react-router-dom';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';

export default function Home() {
    const { isAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const HandleSubmit = () => {
        //     logic
    }

    // TODO: Consider removing the CardContainer classnames, as I don't use them for css (yet)?

    return (
        <main>
            <OuterContainer type="main">
                <PageContainer>
                    <CardContainer className="introduction">
                        <h2>Hello world!</h2>
                        <p>Welcome to PLAYGROUND! I have created this page for people that are always looking for
                            new music to expand their collection with.</p>
                        <p>Play around, tell us what you like, listen to the
                            song selection and add them to your own personal library.</p>
                    </CardContainer>

                    {/*TODO: This section still needs work, I want to create a log in form with only 2 fields, and a 'register' button that links to the registration page*/}
                    <CardContainer className="login-account">
                        <CardTopBar cardName="registration-form" color="secondary">
                            <h3>Log in to your account to save your playlists</h3>
                        </CardTopBar>
                        <form className="form" onSubmit={HandleSubmit}>
                                {/*TODO: I want to create logic where you can log in with username or e-mail*/}
                                <InputField
                                    type="text"
                                    id="username-or-email"
                                    className="form-input"
                                    placeholder="Username or e-mail"
                                    required={true}
                                />
                                <InputField
                                    type="text"
                                    id="password"
                                    className="form-input"
                                    placeholder="Password"
                                    required={true}
                                />
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
                    </CardContainer>

                    {/*TODO: This section appears when user is logged in*/}
                    {isAuth ?
                    <CardContainer className="connect-spotify">
                        <div className="spotify-img-wrapper">
                            <img src={spotifyLogo} alt="spotify-logo"/>
                        </div>
                        <p>Connect your Spotify account to your profile and import your playlists directly to
                            Spotify</p>
                    </CardContainer>
                        :
                        <></>
                    }

                    {/*TODO: Consideration: only one is visible, first a selection tool for one or the other? Artist or Genre*/}
                    <CardContainer className="genre-selection-wrapper">
                        <CardTopBar
                            cardName="genre-selection" color="secondary">
                            {/*TODO: when clicked the magnifying glass, the search will execute based on the input, the input will stay visible*/}
                            <Button type="button" className="search-button--genre">
                                <MagnifyingGlass size={32} className="search-icon-genre"/>
                            </Button>
                            <h3>Select your favorite genres</h3>
                            {/*TODO: When clicked a pop up screen will appear with a search bar to look for specific genre group, and to type in a specific genre and clickable buttons, when clicked, the genre is automatically are added to the list that is displayed on the home screen, and added to a momentary array, until deleted (maybe a current search array that is default empty) */}
                            <Button
                                type="button"
                                className="genre-selection-button"
                                buttonText="More"
                            >
                                <Funnel size={24}/>
                            </Button>
                        </CardTopBar>
                        <div className="genre-selection">
                            <Button
                                className="selected-genre"
                                buttonText="Genre1"
                                hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                            />
                            <Button
                                className="selected-genre"
                                buttonText="Genre2"
                                hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                            />
                            {/*TODO: add a button element that when clicked it will clear the whole selection.*/}
                        </div>
                    </CardContainer>

                    <CardContainer className="artist-selection-wrapper">
                        <CardTopBar cardName="artist-selection" color="light">
                            <h3>What is the name of your favorite artist?</h3>
                        </CardTopBar>
                        <div className="artist-selection">
                            <form>
                                <Button type="submit" className="search-button--genre">
                                    <MagnifyingGlass size={32} className="search-icon-genre"/>
                                </Button>
                                <InputField
                                    type="text"
                                    id="artistName"
                                    className="artist-selection-input"
                                    placeholder="Artist Name"
                                    required={true}
                                />
                            </form>
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
        </main>
    )
}