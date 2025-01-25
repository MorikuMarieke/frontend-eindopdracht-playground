import './Button.css';
import {useState} from 'react';

export default function Button({
                                   type,
                                   onClick,
                                   className,
                                   buttonText,
                                   defaultIcon,
                                   hoveredIcon,
                                   disabled,
                                   children
                               }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type={type}
            onClick={onClick}
            className={`button ${className} ${isHovered ? 'hover' : ''} ${disabled ? 'disabled' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled}
        >
            {buttonText}
            {isHovered ? hoveredIcon : defaultIcon}
            {children}
        </button>
    );
};