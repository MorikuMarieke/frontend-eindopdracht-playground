import {Heart} from '@phosphor-icons/react';
import './FavoriteIcon.css'
import {useContext} from 'react';
import {AuthContext} from '../../context/AuthContext.jsx';
import Button from '../button/Button.jsx';

export default function FavoriteIcon({playlistId, size = 24}) {
    const {favoritePlaylists, addFavoritePlaylist, removeFavoritePlaylist} = useContext(AuthContext);

    const isFavorite = favoritePlaylists.includes(playlistId);

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
            style={{width: size, height: size}}
        >
            <Heart
                className={`heart-fill ${isFavorite ? 'favorite' : 'not-favorite'}`}
                weight="fill"
                size={size}
            />
            <Heart
                className="heart-outline"
                weight="regular"
                size={size}
            />
        </Button>
    );
}