import React from 'react';
import './NavBar.css';
// import logo from '../assets/Logo_Spotify_Playground_without_background.png';

function NavBar() {
    return (
        <nav className="nav-bar">
            <h1>- Playground -</h1>
            <ul className="nav-bar-links">
                <li>Playlists</li>
                <li>Profile</li>
            </ul>
        </nav>
    )
}

export default NavBar;