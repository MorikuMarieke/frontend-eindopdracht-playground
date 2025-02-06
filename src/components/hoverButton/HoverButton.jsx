import React, { useState } from 'react';

function HoverButton({ onHover, onLeave, hoverIcon, defaultIcon }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (onHover) {
            onHover();
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (onLeave) {
            onLeave();
        }
    };

    return (
        <button
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {isHovered ? hoverIcon : defaultIcon}
        </button>
    );
}

export default HoverButton;