import './ArtistInfoCard.css';
import {Link} from 'react-router-dom';

export default function ArtistInfoCard({artistName, artistId, followers, popularity, imgSrc, imgAlt, className, children}) {
    return (
        <div>

            <article className={className}>
                <div className="artist-img-wrapper">
                    <img src={imgSrc} alt={imgAlt}/>
                </div>
                {children}
            </article>
        </div>
    )
}