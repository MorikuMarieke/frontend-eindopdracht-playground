import React, {useContext, useState} from 'react';
import './Profile.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {Pencil} from '@phosphor-icons/react';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';


function Profile() {
    const { isAuth, user } = useContext(AuthContext);

    const HandleSubmit = () => {
        //     logic
    }
    return (
        <>
            <main>
                <OuterContainer type="main">
                    <PageContainer>
                        <CardContainer className="introduction">
                            <h2>Hello {isAuth ? user?.username : ''}!</h2>
                        </CardContainer>

                        {/*TODO: This section still needs work, I want to create a log in form with only 2 fields, and a 'register' button that links to the registration page*/}
                        <CardContainer className="account-details-wrapper">
                            <CardTopBar cardName="registration-form" color="secondary">
                                <h3>Account details</h3>
                            </CardTopBar>
                            <form className="form" onSubmit={HandleSubmit}>
                                {/*TODO: I want to create logic where you can log in with username or e-mail*/}
                                <InputField
                                    type="text"
                                    id="username"
                                    className="form-input"
                                    placeholder={isAuth ? user?.username : 'username'}
                                    required={true}
                                />
                                <InputField
                                    type="text"
                                    id="email"
                                    className="form-input"
                                    placeholder={isAuth ? user?.email : 'username'}
                                    required={true}
                                />
                                <InputField
                                    type="text"
                                    id="password"
                                    className="form-input"
                                    placeholder={isAuth ? user?.password : 'username'}
                                    required={true}
                                />
                                <div className="login-form-button-container">
                                    <Button
                                        buttonText="Edit"
                                        type="submit"
                                        className="secondary-button"
                                    />
                                    {/*TODO button logic that if it says EDIT, when you click it, the fields above become adaptable, then the buttons: SAVE appears, when SAVE is clicked, the information that was entered will be changed to the profile data. */}
                                    <Button
                                        buttonText="Save"
                                        type="button"
                                        className="secondary-button"
                                        onClick={HandleSubmit}
                                    />
                                </div>
                            </form>
                        </CardContainer>
                        {/*TODO: Logic for displaying all playlist names and descriptions?*/}
                        <CardContainer className="card--my-playlists-wrapper">
                            <CardTopBar cardName="my-playlists" color="primary">
                                <h3>My playlists</h3>
                                {/*TODO: When clicked, you go to page: my playlists where you can edit the playlists*/}
                                <Button
                                    type="button"
                                    className="button--edit-my-playlists"
                                    buttonText="Edit"
                                >
                                    <Pencil size={24}/>
                                </Button>
                            </CardTopBar>
                            <div className="card--my-playlists">
                                <div className="my-playlists">
                                    <p>List of playlists will be displayed here with clickable links</p>
                                </div>
                            </div>
                        </CardContainer>

                        {/*TODO: This section appears when spotify account is not yet connected*/}
                        <CardContainer className="connect-spotify">
                            <div className="spotify-img-wrapper">
                                <img src={spotifyLogo} alt="spotify-logo"/>
                            </div>
                            <p>Connect your Spotify account to your profile and import your playlists directly to
                                Spotify</p>
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>
    )
}

export default Profile;