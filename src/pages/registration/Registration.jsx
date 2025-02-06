import React, {useState} from 'react';
import './Registration.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {useNavigate} from 'react-router-dom';
import {NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import axios from 'axios';

export default function Registration() {
    // State voor het formulier
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // State voor functionaliteit
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const navigate = useNavigate();



    async function handleSubmit(e) {
        e.preventDefault();
        toggleError(false);
        toggleLoading(true);

        try {
            await axios.post(`${NOVI_PLAYGROUND_BACKEND}register`, {
                email: email,
                password: password,
                username: username,
            });
            navigate('/');
        } catch(e) {
            console.error(e);
            toggleError(true);
        } finally {
            toggleLoading(false);
        }
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
                    <form className="form registration-form" onSubmit={handleSubmit}>
                        <InputField
                            type="text"
                            id="username-field"
                            name="username"
                            value={username}
                            className="form-input"
                            placeholder="Name"
                            required={true}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputField
                            type="email"
                            id="email-field"
                            name="email"
                            value={email}
                            className="form-input"
                            placeholder="E-mail"
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField
                            type="password"
                            id="password-field"
                            name="password"
                            value={password}
                            className="form-input"
                            placeholder="Password"
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="error">This email address has already been used. Try another e-mail address.</p>}
                        <Button
                            buttonText="Register"
                            type="submit"
                            className="secondary-button"
                            disabled={loading}
                        />
                    </form>

                </PageContainer>
            </OuterContainer>
        </main>
    )
}