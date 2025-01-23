import React from 'react';
import './Home.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';

export default function Home() {

    function HandleSubmit() {
    //     logic
    }
    return (
        <OuterContainer type="main">
            <main className="inner-container">
            <section className="introduction">
                <h2>Hello world!</h2>
                <p>Welcome to PLAYGROUND! I have created this page for those people that are always looking for new music to expand their collection with. Play around, tell us what you like, listen to the song selection and add them to your own personal library.</p>
            </section>
                <section className="create-account">
                    <form className="registration-form" onSubmit={HandleSubmit}>
                        <div className="registration-form-title">
                            <h3>Create an account to save your playlists</h3>
                        </div>
                        <div className="registration-form-container">

                        </div>
                    </form>
                </section>
            </main>
        </OuterContainer>
    )
}