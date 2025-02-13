import './Button.css';
import {useState} from 'react';

export default function Button({
            type,
            onClick,
            className,
            buttonText,
            isSelected,
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
            {/* Show the check icon by default if selected, otherwise nothing */}
            {isSelected && (isHovered ? hoveredIcon : defaultIcon)}
            {children}
        </button>
    );
};