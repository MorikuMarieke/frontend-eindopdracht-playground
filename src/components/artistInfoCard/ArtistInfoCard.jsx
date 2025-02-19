import './ArtistInfoCard.css';
import {Link} from 'react-router-dom';

export default function ArtistInfoCard({artistName, artistId, followers, popularity, imgSrc, imgAlt}) {
    return (
        <div className="artist-info">

            <article className="artist-info-card">
                <h3><Link to={`/artist/${artistId}`}>{artistName}</Link></h3>
                <div className="artist-img-wrapper">
                    <img src={imgSrc} alt={imgAlt}/>
                </div>
                <p>Followers: {followers}</p>
                <p>Popularity: {popularity}</p>
            </article>
        </div>
    )
}