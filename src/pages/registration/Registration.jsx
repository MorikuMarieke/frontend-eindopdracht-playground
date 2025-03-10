import React, {useState} from 'react';
import './Registration.css'
import {Password, SmileySad} from "@phosphor-icons/react";
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import InputField from '../../components/inputField/InputField.jsx';
import Button from '../../components/button/Button.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import {useNavigate} from 'react-router-dom';
import {NOVI_PLAYGROUND_BACKEND} from '../../constants/constants.js';
import axios from 'axios';
import isPasswordValid from "../../helpers/isPasswordValid.js";


export default function Registration() {
    // State voor het formulier
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, toggleLoading] = useState(false);

    // State voor functionaliteit
    const [generalError, setGeneralError] = useState(null);
    const [userNameError, setUsernameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setGeneralError(null);
        setEmailError(null);
        setUsernameError(null);
        setPasswordError(null);
        toggleLoading(true);

        if (!isPasswordValid(password)) {
            setPasswordError("Please enter a stronger password.");
        } else {

            try {
                await axios.post(`${NOVI_PLAYGROUND_BACKEND}/users`, {
                    email: email,
                    password: password,
                    username: username,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': import.meta.env.VITE_API_KEY
                    }
                });
                navigate('/');
            } catch (e) {
                console.error(e);
                if (e.response && e.response.status === 409) {
                    const errorMessage = e.response.data;
                    if (typeof errorMessage === 'string') {
                        if (errorMessage.toLowerCase().includes('username')) {
                            setUsernameError(errorMessage);
                            console.log(errorMessage);
                        } else if (errorMessage.toLowerCase().includes('email')) {
                            setEmailError(errorMessage);
                            console.log(errorMessage);
                        } else {
                            setGeneralError(errorMessage);
                            console.log(errorMessage);
                        }
                    }
                } else {
                    setGeneralError('Something went wrong. Please try again later.')
                }
            } finally {
                toggleLoading(false);
            }
        }
    }

    function handlePasswordChange(e) {
        const value = e.target.value;
        setPassword(value);

        if (value.length === 0) {
            setPasswordError('Password cannot be empty.');
        } else if (!isPasswordValid(value)) {
            setPasswordError(
                'Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
        } else {
            setPasswordError('');
        }
    }

    return (
        <main>
            <OuterContainer type="registration">
                <PageContainer className="page-registration">
                    <CardContainer className="create-account">
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
                                onChange={handlePasswordChange}
                            />
                            <Button
                                buttonText="Register"
                                type="submit"
                                className="secondary-button"
                                disabled={loading}
                            />
                        </form>
                    </CardContainer>
                    {passwordError &&
                        <CardContainer>
                            <CardTopBar color="primary" cardName="registration-error-message">
                                <Password size={32}/><h3>Password rules</h3>
                            </CardTopBar>
                            <div className="card--register-error-message">
                                {passwordError && <p className="error">{passwordError}</p>}

                                {/*TODO: Still need to add password error with conditions.*/}

                            </div>
                        </CardContainer>
                    }
                    {(userNameError || emailError || generalError) &&
                        <CardContainer>
                            <CardTopBar color="primary" cardName="registration-error-message">
                                <SmileySad size={32}/><h3>Oops! Something went wrong</h3>
                            </CardTopBar>
                            <div className="card--register-error-message">
                                {userNameError && <p className="error">{userNameError}</p>}
                                {emailError && <p className="error">{emailError}</p>}
                                {generalError && <p className="error">{generalError}</p>}

                                {/*TODO: Still need to add password error with conditions.*/}

                            </div>
                        </CardContainer>
                    }
                </PageContainer>
            </OuterContainer>
        </main>
    )
}