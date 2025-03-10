import React from 'react';
import {NavLink} from 'react-router-dom';
import Avatar from '../avatar/Avatar.jsx';
import {SignOut} from '@phosphor-icons/react';
import Button from '../button/Button.jsx';

function DesktopNav({isAuth, logo}) {
    return (
        <nav className="desktop-nav">
            {/* Logo & Title Section */}
            <NavLink to="/">
                <div className="logo-title-wrapper desktop">
                    <div className="logo-img-wrapper">
                        <img className="logo-img" src={logo} alt="website-logo"/>
                    </div>
                    <div className="logo-subtitle-wrapper">
                        <h1>Playground</h1>
                        <p>Play around and create your personal jam!</p>
                    </div>
                </div>
            </NavLink>

            {/* Desktop Navigation Menu */}
            <div className="desktop-menu">
                <ul className="desktop-menu-list">
                    {isAuth ? (
                        <>
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/playlist-overview">Playlists</NavLink></li>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            <li>
                                <Button
                                    className="sign-out-button"
                                    buttonText="Sign out"
                                    type="button">
                                    <SignOut size={32}/>
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/registration">Register</NavLink></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default DesktopNav;
