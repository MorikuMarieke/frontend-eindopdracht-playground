import React, {useState} from 'react';
import './GenreSelection.css'
import OuterContainer from '../../components/outerContainer/OuterContainer.jsx';
import PageContainer from '../../components/pageContainer/PageContainer.jsx';
import CardContainer from '../../components/cardContainer/CardContainer.jsx';
import CardTopBar from '../../components/cardTopBar/CardTopBar.jsx';
import Button from '../../components/button/Button.jsx';
import {CheckCircle, XCircle} from '@phosphor-icons/react';
import {useNavigate} from 'react-router-dom';
import '../../constants/genreArray.js'
import {genres} from '../../constants/genreArray.js';

function GenreSelection() {
    const [selectedGenres, setSelectedGenres] = useState([]);

    const navigate = useNavigate();

    function handleGenreToggle(genre) {
        setSelectedGenres((prevSelectedCategories) => {
            const isSelected = prevSelectedCategories.some(
                (selected) => selected.id === genre.id
            );

            if (isSelected) {
                // Deselect genre
                return prevSelectedCategories.filter(
                    (selected) => selected.id !== genre.id
                );
            } else {
                // Select genre
                return [...prevSelectedCategories, genre];
            }
        });
    }

    function handleFinishSelectionClick() {
        localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));
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
                        {(selectedGenres.length > 0) && (
                            <ul className="selected-categories-container">
                                <h3>Selected categories</h3>

                                {selectedGenres.map((genre) => (
                                    <li key={`${genre.id}-${genre.name}`}>
                                        <Button
                                            className="selected-category"
                                            buttonText={genre.name}
                                            onClick={() => handleGenreToggle(genre)}
                                            isSelected={true}
                                            defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                                            hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                            type="button"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <ul className="selectable-categories-container">
                            <h3>Selectable categories</h3>
                            {genres.map((genre) => {
                                const isSelected = selectedGenres.some((selected) => selected.id === genre.id);

                                return (
                                    <li key={`${genre.id}-${genre.name}`}>
                                        <Button
                                            className={`selectable-category ${isSelected ? "selected-category" : ""}`}
                                            buttonText={genre.name}
                                            onClick={() => handleGenreToggle(genre)}
                                            isSelected={isSelected} // Pass selection state
                                            defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                                            hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
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

export default GenreSelection;





