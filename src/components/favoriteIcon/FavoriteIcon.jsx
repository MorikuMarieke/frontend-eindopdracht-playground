import {Heart} from '@phosphor-icons/react';
import './FavoriteIcon.css'
import {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext.jsx';
import Button from '../button/Button.jsx';

export default function FavoriteIcon({ playlistId, size = 24 }) {
    // Get favoritePlaylists and the functions from AuthContext
    const { favoritePlaylists, addFavoritePlaylist, removeFavoritePlaylist } = useContext(AuthContext);

    // Check if the current playlistId is already in the favorites array
    const isFavorite = favoritePlaylists.includes(playlistId);

    // Toggle favorite status on click
    const handleClick = () => {
        if (isFavorite) {
            removeFavoritePlaylist(playlistId);
        } else {
            addFavoritePlaylist(playlistId);
        }
    };

    return (
        <Button
            type="button"
            onClick={handleClick}
            className="favorite-icon"
            style={{ width: size, height: size }}
        >
            {/* Background filled icon: displays filled color if isFavorite is true */}
            <Heart
                className={`heart-fill ${isFavorite ? 'favorite' : 'not-favorite'}`}
                weight="fill"
                size={size}
            />
            {/* Outline icon always on top */}
            <Heart
                className="heart-outline"
                weight="regular"
                size={size}
            />
        </Button>
    );
}