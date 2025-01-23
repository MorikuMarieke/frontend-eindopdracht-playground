import './OuterContainer.css';
import React from 'react';

function OuterContainer({children, type}) {
    return (
        <div className={`outer-container ${type ? `outer-container--${type}` : ''}`}>
            { children }
        </div>
    )
}

export default OuterContainer;