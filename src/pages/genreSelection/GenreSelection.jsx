import React, {useEffect, useState} from 'react';
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
import InputField from '../../components/inputField/InputField.jsx';

function GenreSelection() {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGenres, setFilteredGenres] = useState(genres);

    const navigate = useNavigate();

    useEffect(() => {
        filterGenres(searchQuery);
    }, [searchQuery]);

    function handleGenreToggle(genre) {
        setSelectedGenres((prevSelectedGenres) => {
            const isSelected = prevSelectedGenres.some(
                (selected) => selected.id === genre.id
            );

            if (isSelected) {
                // Deselect genre
                return prevSelectedGenres.filter(
                    (selected) => selected.id !== genre.id
                );
            } else {
                // Select genre
                return [...prevSelectedGenres, genre];
            }
        });
    }

    function filterGenres(query) {
        const lowerSearchQuery = query.toLowerCase();
        const newFilteredGenres = genres.filter(genre => {
            return genre.name.toLowerCase().split(' ').some(word => word.startsWith(lowerSearchQuery));
        });
        setFilteredGenres(newFilteredGenres);
    }

    function handleQueryChange(e) {
        setSearchQuery(e.target.value)
    }

    function handleFinishSelectionClick() {
        localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));
        console.log(selectedGenres)
        navigate("/");
    }

    return (
        <main>
            <OuterContainer>
                <PageContainer className="page-genre-selection">
                    <CardContainer className="genre-selection-container">
                        <CardTopBar cardName="genre-selection" color="secondary">
                            <h3>Genres to select</h3>
                            <Button
                                type="button"
                                className="button--select-genres"
                                buttonText="Done"
                                onClick={handleFinishSelectionClick}
                            >
                                <CheckCircle size={24}/>
                            </Button>
                        </CardTopBar>
                        {(selectedGenres.length > 0) && (
                            <ul className="selected-genres-container">
                                <h3>Selected genres</h3>

                                {selectedGenres.map((genre) => (
                                    <li key={`${genre.id}-${genre.name}`}>
                                        <Button
                                            className="selected-genre"
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
                        <div className="selectable-genres-container">
                            <h3>Select genres from the list below</h3>
                            <InputField
                                className="genre-search-query"
                                type="text"
                                placeholder="Type to filter..."
                                value={searchQuery}
                                onChange={handleQueryChange}
                                maxLength={15}
                            />
                            <ul className="selectable-genres-list">
                                {filteredGenres.map((genre) => {
                                    const isSelected = selectedGenres.some((selected) => selected.id === genre.id);

                                    return (
                                        <li key={`${genre.id}-${genre.name}`}>
                                            <Button
                                                className={`selectable-genre ${isSelected ? "selected-genre" : ""}`}
                                                buttonText={genre.name}
                                                onClick={() => handleGenreToggle(genre)}
                                                isSelected={isSelected}
                                                defaultIcon={<CheckCircle className="default-icon" size={22}/>}
                                                hoveredIcon={<XCircle className="hovered-icon" size={22}/>}
                                                type="button"
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </CardContainer>
                </PageContainer>
            </OuterContainer>
        </main>
    )
}

export default GenreSelection;





