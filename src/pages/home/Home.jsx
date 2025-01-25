import React, {useState} from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {MagnifyingGlass, Funnel, CheckCircle, XCircle} from "@phosphor-icons/react";
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';

export default function Home() {

    const HandleSubmit = () => {
        //     logic
    }

    return (
        <OuterContainer type="main">
            <main className="inner-container">
                <section className="introduction">
                    <h2>Hello world!</h2>
                    <p>Welcome to PLAYGROUND! I have created this page for those people that are always looking for new
                        music to expand their collection with. Play around, tell us what you like, listen to the song
                        selection and add them to your own personal library.</p>
                </section>
                <section className="create-account">
                    <form className="registration-form" onSubmit={HandleSubmit}>
                        <CardTopBar
                            cardName="registration-form"
                        >
                            {/*<div className="registration-form-title">*/}
                            <h3>Log in to your account to save your playlists</h3>
                            {/*</div>*/}
                        </CardTopBar>
                        <div className="registration-form-container">
                            <InputField
                                className="registration-form-input"
                                placeholder="Name"
                            />
                            <InputField
                                className="registration-form-input"
                                placeholder="E-mail"
                            />
                            <InputField
                                className="registration-form-input"
                                placeholder="Password"
                            />
                            <Button
                                buttonText="Log in"
                                type="submit"
                                className="login-button"
                            />
                        </div>
                    </form>
                </section>
                <section className="connect-spotify">
                    <div className="spotify-img-wrapper">
                        <img src={spotifyLogo} alt="spotify-logo"/>
                    </div>
                    <p>Connect your Spotify account to your profile and import your playlists directly to Spotify</p>
                </section>
                <section className="genre-selection-wrapper">
                    <CardTopBar
                        cardName="genre-selection">
                        <Button type="button" className="search-button--genre">
                            <MagnifyingGlass size={32} className="search-icon-genre"/>
                        </Button>
                        <h3>Select your favorite genres</h3>
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
                            hoveredIcon={<XCircle className="hovered-icon" size={22} />}
                            defaultIcon={<CheckCircle className="default-icon" size={22} />}
                        />
                        <Button
                            className="selected-genre"
                            buttonText="Genre2"
                            hoveredIcon={<XCircle className="hovered-icon" size={22} />}
                            defaultIcon={<CheckCircle className="default-icon" size={22} />}
                        />
                    </div>
                </section>
            </main>
        </OuterContainer>
    )
}