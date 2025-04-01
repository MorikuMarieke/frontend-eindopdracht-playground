import React from 'react';
import './ErrorPage.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import {NavLink} from 'react-router-dom';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';

function ErrorPage() {
    return (
        <>
            <main>
                <OuterContainer type="main">
                    <PageContainer className="page-error">
                            <section className="error-card">
                                <h2>Oops something went wrong!</h2>
                                <p>Register or log into your account to visit this page.</p>
                                <p>Click <NavLink to="/">here</NavLink> to go back to the home-page.</p>
                            </section>
                    </PageContainer>
                </OuterContainer>
            </main>
        </>
    )
}

export default ErrorPage;