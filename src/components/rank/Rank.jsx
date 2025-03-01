import './Rank.css';
import React from 'react';

export default function Rank({index, color}) {
    return(
        <div className={`item-rank rank-color-${color}`}>
            <h5>#{index + 1}</h5>
        </div>
    )
}