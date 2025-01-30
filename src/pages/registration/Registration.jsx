import React, {useState} from 'react';
import './Registration.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';

export default function Home() {

    const HandleSubmit = () => {
        //     logic
    }

    return (
        <main>
            <OuterContainer type="registration">
                <PageContainer className="page-registration">
                    <CardContainer className="create-account">
                    </CardContainer>
                    <CardTopBar cardName="registration-form" color="secondary">
                        <h3>Create an account to save your playlists and connect your Spotify account</h3>
                    </CardTopBar>
                    <form className="form registration-form" onSubmit={HandleSubmit}>
                        <InputField
                            type="text"
                            id="username"
                            className="form-input"
                            placeholder="Name"
                            required={true}
                        />
                        <InputField
                            type="text"
                            id="email"
                            className="form-input"
                            placeholder="E-mail"
                            required={true}
                        />
                        <InputField
                            type="text"
                            id="password"
                            className="form-input"
                            placeholder="Password"
                            required={true}
                        />
                        <Button
                            buttonText="Register"
                            type="submit"
                            className="secondary-button"
                        />
                    </form>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}