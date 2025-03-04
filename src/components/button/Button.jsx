import './Button.css';
import {useState} from 'react';

export default function Button({
            type,
            onClick,
            className = '',
            buttonText,
            isSelected,
            defaultIcon,
            hoveredIcon,
            disabled,
            style,
            children
}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${className} ${isHovered ? 'hover' : ''} ${disabled ? 'disabled' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled}
            style={style}
        >
            {buttonText}
            {isSelected && (isHovered ? hoveredIcon : defaultIcon)}
            {children}
        </button>
    );
};