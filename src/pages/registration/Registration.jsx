import React, {useState} from 'react';
import './Registration.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';

export default function Home() {

    const HandleSubmit = () => {
        //     logic
    }

    return (
        <main>
            <OuterContainer type="registration">
                <div className="inner-container page-registration">
                    <section className="create-account">
                        <form className="registration-form" onSubmit={HandleSubmit}>
                            <CardTopBar
                                cardName="registration-form"
                            >
                                <h3>Create an account to save your playlists and connect your Spotify account</h3>
                            </CardTopBar>
                            <div className="registration-form-container">
                                <InputField
                                    type="text"
                                    id="username"
                                    className="registration-form-input"
                                    placeholder="Name"
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
                                <Button
                                    buttonText="Register"
                                    type="submit"
                                    className="registration-button"
                                />
                            </div>
                        </form>
                    </section>
                </div>
            </OuterContainer>
        </main>
    )
}