import React from 'react';
import './GridAnimation.css';

const GridAnimation = () => {
    return (
        <div className="grid-container">
            <div className="grid-overlay"></div>
            <div className="grid-lines"></div>
            <div className="grid-dots"></div>
        </div>
    );
};

export default GridAnimation;
