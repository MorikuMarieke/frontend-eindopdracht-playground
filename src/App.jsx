import React from 'react';
import './App.css'
import NavBar from './components/navBar/NavBar.jsx';
import {Route, Routes} from "react-router-dom";
import Home from './pages/home/Home.jsx';
import PlaylistOverview from './pages/playlistOverview/PlaylistOverview.jsx';
import Profile from './pages/profile/Profile.jsx';
import Playlist from './pages/playlist/Playlist.jsx';
import ErrorPage from './pages/errorPage/ErrorPage.jsx';
import Footer from './components/footer/Footer.jsx';

function App() {

  return (
    <>
        <NavBar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playlist-overview" element={<PlaylistOverview />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/error" element={<ErrorPage />} />
        </Routes>
        <Footer/>
    </>
  )
}

export default App
