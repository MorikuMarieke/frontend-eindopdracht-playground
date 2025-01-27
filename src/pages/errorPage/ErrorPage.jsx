import React from 'react';
import './ErrorPage.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import {NavLink} from 'react-router-dom';

function ErrorPage() {
    return (
        <>
            <main>
                <OuterContainer type="main">
                    <div className="page-error">
                        <section className="error-card">
                            <h2>Oops something went wrong!</h2>
                            <p>Click <NavLink to="/">here</NavLink> to go back to the home-page
                                te gaan.</p>
                        </section>

                    </div>
                </OuterContainer>
            </main>
        </>
    )
}

export default ErrorPage;