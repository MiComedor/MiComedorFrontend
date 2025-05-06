import React from 'react';
import './Welcome.css';

const Welcome: React.FC = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <h1 className="titulo-Pderecho  display-4">BIENVENIDOS</h1>
            <img
                src="/assets/logo.png"
                alt="Logo"
                className="welcome-logo mt-3 img-fluid"
            />
        </div>
    );
};

export default Welcome;
