import './Avatar.css';
import defaultAvatar from '../../assets/avatar-default-white.svg'

export default function Avatar({imgSrc, alt}) {
    return (
        <div className="avatar">
            <img className="avatar-img" src={imgSrc ? imgSrc : defaultAvatar} alt={alt} />
        </div>
    )
}