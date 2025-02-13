import React, {useEffect, useState} from 'react';
import './CategorySelection.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {CheckCircle, XCircle} from '@phosphor-icons/react';
import axios from 'axios';
import {API_BASE} from '../../constants/constants.js';
import {useNavigate} from 'react-router-dom';

function CategorySelection() {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchToken() {
            const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
            const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

            const authString = btoa(`${clientId}:${clientSecret}`);

            try {
                const response = await axios.post(
                    "https://accounts.spotify.com/api/token",
                    new URLSearchParams({grant_type: "client_credentials"}),
                    {
                        headers: {
                            Authorization: `Basic ${authString}`,
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }
                );
                localStorage.setItem("spotifyToken", response.data.access_token);
            } catch (e) {
                console.error("Error fetching token:", e);
            }
        }

        async function fetchAllCategories() {
            const limit = 50;
            let offset = 0;
            let allCategories = [];

            try {
                const token = localStorage.getItem("spotifyToken");

                const firstResponse = await axios.get(`${API_BASE}browse/categories`, {
                    params: {
                        locale: "en_US",
                        limit,
                        offset
                    }, headers: {Authorization: `Bearer ${token}`},
                });
                console.log("First response", firstResponse);

                allCategories = [...firstResponse.data.categories.items];
                const total = firstResponse.data.categories.total;
                // console.log("Total is", total);

                const requests = [];
                for (offset = limit; offset < total; offset += limit) {
                    requests.push(
                        axios.get(`${API_BASE}browse/categories`, {
                            params: {locale: "en_US", limit, offset},
                            headers: {Authorization: `Bearer ${token}`},
                        })
                    );
                }

                // **Execute all remaining requests in parallel**
                const responses = await Promise.all(requests);
                responses.forEach((res) => {
                    allCategories = [...allCategories, ...res.data.categories.items];
                });

                console.log("All Categories:", allCategories);
                setCategories(allCategories);
            } catch (e) {
                console.error("Error fetching categories:", e);
            }
        }

        const fetchData = async () => {
            await fetchToken();
            await fetchAllCategories();
        };

        fetchData();
    }, []);

    function handleCategoryToggle(category) {
        setSelectedCategories((prevSelectedCategories) => {
            const isSelected = prevSelectedCategories.some(
                (selected) => selected.id === category.id
            );

            if (isSelected) {
                // Deselect category
                return prevSelectedCategories.filter(
                    (selected) => selected.id !== category.id
                );
            } else {
                // Select category
                return [...prevSelectedCategories, category];
            }
        });
    }

    function handleFinishSelectionClick() {
        localStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));
        navigate("/");
    }


    return (
        <main>
            <OuterContainer type="category-selection">
                <PageContainer className="page-category-selection">
                    <CardContainer className="category-selection-container">
                        <CardTopBar cardName="category-selection" color="secondary">
                            <h3>Categories to select</h3>
                            <Button
                                type="button"
                                className="button--select-categories"
                                buttonText="Done"
                                onClick={handleFinishSelectionClick}
                            >
                                <CheckCircle size={24}/>
                            </Button>
                        </CardTopBar>
                        {(selectedCategories.length > 0) && (
                            <ul className="selected-categories-container">
                                <h3>Selected categories</h3>

                                {selectedCategories.map((category) => (
                                    <li key={category.id}>
                                        <Button
                                            className="selected-category"
                                            buttonText={category.name}
                                            onClick={() => handleCategoryToggle(category)}
                                            isSelected={true}
                                            defaultIcon={<CheckCircle className="default-icon" size={22} />}
                                            hoveredIcon={<XCircle className="hovered-icon" size={22} />}
                                            type="button"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <ul className="selectable-categories-container">
                            <h3>Selectable categories</h3>
                            {categories.map((category) => {
                                const isSelected = selectedCategories.some((selected) => selected.id === category.id);

                                return (
                                    <li key={category.id}>
                                        <Button
                                            className={`selectable-category ${isSelected ? "selected-category" : ""}`}
                                            buttonText={category.name}
                                            onClick={() => handleCategoryToggle(category)}
                                            isSelected={isSelected} // Pass selection state
                                            defaultIcon={<CheckCircle className="default-icon" size={22} />}
                                            hoveredIcon={<XCircle className="hovered-icon" size={22} />}
                                            type="button"
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}

export default CategorySelection;





