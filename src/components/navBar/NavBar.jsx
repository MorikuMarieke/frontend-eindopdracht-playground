import React, {useContext} from 'react';
import './NavBar.css';
import logo from '../../assets/website_logo_beige.svg';
import OuterContainer from '../outerContainer/OuterContainer.jsx';
import {NavLink} from 'react-router-dom';
import Avatar from '../avatar/Avatar.jsx';
import {AuthContext} from '../../context/AuthContext.jsx';
import {SignOut} from '@phosphor-icons/react';
import Button from '../button/Button.jsx';

function NavBar() {
    const {isAuth, user} = useContext(AuthContext);
    const data = useContext(AuthContext);
    // console.log(data);

    return (
        <header>
            <OuterContainer type="nav-bar">
                <nav className="nav-bar">
                    <NavLink to="/">
                        <div className="logo-title-wrapper">
                            <div className="logo-img-wrapper">
                                <img className="logo-img" src={logo} alt="website-logo"/>
                            </div>
                            <div className="logo-subtitle-wrapper">
                                <h1>Playground</h1>
                                <p>Play around and create your personal jam!</p>
                            </div>
                        </div>
                    </NavLink>
                    <div className="nav-links-wrapper">
                        <ul className="nav-bar-links">
                            {isAuth ?
                                <>
                                    <li><NavLink to="/playlist-overview">Playlists</NavLink></li>
                                    <li><NavLink to="/profile">Profile</NavLink></li>
                                </>
                                :
                                <>
                                    <li><NavLink to="/registration">Register</NavLink></li>
                                    {/*<li><NavLink to="/profile">Profile</NavLink></li>*/}
                                </>
                            }
                        </ul>
                        <Avatar/>
                        <Button type="button">
                            <SignOut size={32} />
                        </Button>
                    </div>
                </nav>
            </OuterContainer>
        </header>
    )
}

export default NavBar;