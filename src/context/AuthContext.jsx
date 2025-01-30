import React, {createContext, useState} from 'react';

export const AuthContext = createContext({});

export function AuthContextProvider({children}) {

    const [auth, setAuth] = useState({
        isAuth: false,
        user: {},
    });

    // const [spotifyAuth, setSpotifyAuth] = useState({
    //     isSpotifyAuth: false,
    //
    // })

    function signIn(email) {
        setAuth({
            isAuth: true,
            user: {
                username: '',
                email: email,
                id: '',
            }
        });
        console.log('De gebruiker is ingelogd!');
    }

    function signOut() {
        setAuth({
            isAuth: false,
            user: null,
        });
        console.log('De gebruiker is uitgelogd!');
    }

    const data = {
        isAuth: auth.isAuth,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    );
}