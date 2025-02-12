import React, {useContext, useEffect, useState} from 'react';
import './CategorySelection.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {Pencil} from '@phosphor-icons/react';
import {AuthContext} from '../../context/AuthContext.jsx';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';

function CategorySelection() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post(
                    'https://accounts.spotify.com/api/token',
                    new URLSearchParams({grant_type: 'client_credentials'}), // Correctly formatted form data
                    {
                        headers: {
                            'Authorization': `Basic ${authString}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                // console.log(response.data); //logs the access_token
                localStorage.setItem("spotifyToken", response.data["access_token"]);
            } catch (e) {
                console.error(e);
            }
        }

        fetchToken();

        async function getCategories() {
            try {
                const response = await axios.get(`${API_BASE}browse/categories`, {
                    params: {
                        locale: 'en_US',  // Forces English names
                        limit: 50,
                        offset: 10
                    },
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('spotifyToken'),
                    }
                });
                console.log(response.data);
                const listOfCategories = response.data.categories.items.map(category => ({
                    id: category.id,
                    name: category.name,
                }));

                console.log(listOfCategories);
                setCategories(listOfCategories);

            } catch (e) {
                console.error(e);
            }
        }

        getCategories();
    }, []);


    return (
            <main>
                <OuterContainer type="category-selection">
                    <PageContainer className="page-category-selection">
                        <CardContainer className="category-selection-wrapper">
                            <CardTopBar cardName="category-selection" color="secondary">
                                <h3>Categories to select</h3>
                                <Button
                                    type="button"
                                    className="button--select-categories"
                                    buttonText="Edit"
                                >
                                    <Pencil size={24}/>
                                </Button>
                            </CardTopBar>
                            <div className="categories-overview-card-wrapper">
                                {categories.map((category, index) => (
                                    <Button
                                        className="selected-category"
                                        buttonText={category.name}
                                    />
                                ))}
                            </div>
                        </CardContainer>
                    </PageContainer>
                </OuterContainer>
            </main>
    )
}

export default CategorySelection;