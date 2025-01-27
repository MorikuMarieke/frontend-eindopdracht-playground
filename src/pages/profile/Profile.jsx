import React from 'react';
import './Profile.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import spotifyLogo from '../../assets/Spotify logo black.png';
import {CheckCircle, Funnel, MagnifyingGlass, XCircle, Pencil} from '@phosphor-icons/react';



function Profile() {

    const HandleSubmit = () => {
        //     logic
    }
    return (
        <>
            <main>
                <OuterContainer type="main">
                    <div className="page-home">

                        <section className="introduction">
                            <h2>Hello [username]!</h2>
                        </section>

                        {/*TODO: This section still needs work, I want to create a log in form with only 2 fields, and a 'register' button that links to the registration page*/}
                        <section className="account-details-wrapper">
                            <form className="login-form" onSubmit={HandleSubmit}>
                                <CardTopBar
                                    cardName="registration-form"
                                >
                                    <h3>Account details</h3>
                                </CardTopBar>
                                <div className="login-form-container">
                                    {/*TODO: I want to create logic where you can log in with username or e-mail*/}
                                    <InputField
                                        type="text"
                                        id="username"
                                        className="registration-form-input"
                                        placeholder="Username or e-mail"
                                        required={true}
                                    />
                                    <InputField
                                        type="text"
                                        id="email"
                                        className="registration-form-input"
                                        placeholder="E-mail"
                                        required={true}
                                    />
                                    <InputField
                                        type="text"
                                        id="password"
                                        className="registration-form-input"
                                        placeholder="Password"
                                        required={true}
                                    />
                                    <div className="login-form-button-container">
                                        <Button
                                            buttonText="Edit"
                                            type="submit"
                                            className="login-button"
                                        />
                                        {/*TODO button logic that if it says EDIT, when you click it, the fields above become adaptable, then the buttons: SAVE appears, when SAVE is clicked, the information that was entered will be changed to the profile data. */}
                                        <Button
                                            buttonText="Save"
                                            type="button"
                                            className="registration-button"
                                            onClick={HandleSubmit}
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        {/*TODO: Logic for displaying all playlist names and descriptions?*/}
                        <section className="card--my-playlists-wrapper">
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
                            <div className="card--my-playlists">
                                <div className="my-playlists">
                                    <p>List of playlists will be displayed here with clickable links</p>
                                </div>
                            </div>
                        </section>

                        {/*TODO: This section appears when spotify account is not yet connected*/}
                        <section className="connect-spotify">
                            <div className="spotify-img-wrapper">
                                <img src={spotifyLogo} alt="spotify-logo"/>
                            </div>
                            <p>Connect your Spotify account to your profile and import your playlists directly to
                                Spotify</p>
                        </section>
                    </div>
                </OuterContainer>
            </main>
        </>
    )
}

export default Profile;