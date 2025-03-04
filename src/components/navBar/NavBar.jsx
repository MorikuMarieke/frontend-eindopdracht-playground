import React, { useContext, useState, useEffect } from 'react';
import './NavBar.css';
import logo from '../../assets/website_logo_beige.svg';
import OuterContainer from '../outerContainer/OuterContainer.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import DesktopNav from './DesktopNav.jsx';
import MobileNav from './MobileNav.jsx';

function NavBar() {
    const { isAuth, signOut } = useContext(AuthContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    // Track screen size for switching between desktop & mobile versions
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header>
            <OuterContainer type="nav-bar">
                {isMobile ?
                    <MobileNav isAuth={isAuth} logo={logo} signOut={signOut} />
                    :
                    <DesktopNav isAuth={isAuth} logo={logo} signOut={signOut} />}
            </OuterContainer>
        </header>
    );
}

export default NavBar;
