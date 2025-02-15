import React, {useContext} from 'react';
import './App.css'
import NavBar from './components/navBar/NavBar.jsx';
import {Navigate, Route, Routes} from "react-router-dom";
import Home from './pages/home/Home.jsx';
import PlaylistOverview from './pages/playlistOverview/PlaylistOverview.jsx';
import Profile from './pages/profile/Profile.jsx';
import Playlist from './pages/playlist/Playlist.jsx';
import ErrorPage from './pages/errorPage/ErrorPage.jsx';
import Registration from './pages/registration/Registration.jsx';
import Footer from './components/footer/Footer.jsx';
import {Helmet} from 'react-helmet-async';
import {AuthContext} from './context/AuthContext.jsx';
import CategorySelection from './pages/categorySelection/CategorySelection.jsx';
import GenreSelection from './pages/genreSelection/GenreSelection.jsx';


function App() {
    const {isAuth} = useContext(AuthContext);

    return (
        <>
            <Helmet>
                <title>Playground</title>
                <meta name="description"
                      content="Novi final assignment Frontend"/>
                <link rel="icon" type="image/svg" href="/favicon.ico"/>
            </Helmet>

            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route
                    path="/profile"
                    element={isAuth === true ?
                        <Profile/>
                        :
                        <Navigate to="/"/>
                    }
                />
                <Route
                    path="/playlist-overview"
                    element={isAuth === true ?
                        <PlaylistOverview/>
                        :
                        <Navigate to="/"/>
                    }
                />
                <Route
                    path="/playlist"
                    element={isAuth === true ?
                        <Playlist/>
                        :
                        <Navigate to="/"/>
                    }
                />
                <Route path="/category-selection" element={<CategorySelection/>}/>
                <Route path="/genre-selection" element={<GenreSelection/>}/>
                <Route path="/error" element={<ErrorPage/>}/>
                <Route path="/registration" element={<Registration/>}/>
            </Routes>
            <Footer/>
        </>
    )
}

export default App
