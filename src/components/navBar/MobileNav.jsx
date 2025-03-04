import React, {useContext, useState} from 'react';
import {NavLink} from 'react-router-dom';
import Avatar from '../avatar/Avatar.jsx';
import {SignOut, List, X} from '@phosphor-icons/react';
import Button from '../button/Button.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';

function MobileNav({isAuth, logo, signOut}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <nav className="mobile-nav">
            {/* Logo & Hamburger Button */}
            <div className="mobile-header">
                <div className="logo-title-wrapper mobile">
                    <div className="logo-img-wrapper mobile">
                        <NavLink to="/">
                            <img className="logo-img" src={logo} alt="website-logo"/>
                        </NavLink>
                    </div>
                    <div className="logo-subtitle-wrapper mobile">
                        <h1>Playground</h1>
                        <p>Play around and create your personal jam!</p>
                    </div>
                </div>

                <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={32}/> : <List size={32}/>}
                </button>
            </div>

            {/* Mobile Menu (Slides In) */}
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                <ul className="mobile-menu-list">
                    <h3>Menu</h3>
                    {isAuth ? (
                        <>
                            <li><NavLink to="/"
                                         onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                            <li><NavLink to="/playlist-overview"
                                         onClick={() => setIsMenuOpen(false)}>Playlists</NavLink></li>
                            <li><NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</NavLink></li>
                            <li>
                                <Button
                                    buttonText="Sign out"
                                    className="light-button"
                                    type="button"
                                    onClick={signOut}>
                                    <SignOut size={24}/>
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
                            <li><NavLink to="/registration" onClick={() => setIsMenuOpen(false)}>Register</NavLink></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default MobileNav;
