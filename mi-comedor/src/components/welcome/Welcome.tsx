import React from 'react';
import './Welcome.css';

const Welcome: React.FC = () => {
    return (
        <div className="welcome-container">
            <h1 className="welcome-title">BIENVENIDOS</h1>
            <img 
            src="/assets/logo.png" 
            alt="Logo" 
            className="welcome-logo" 
            />
        </div>
    );
};

export default Welcome;