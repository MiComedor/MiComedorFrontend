import React from 'react';
import './Welcome.css';

const Welcome: React.FC = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 content-welcome">
            <div className="text-center">
                <h1 className="titulo-wderecho display-4">BIENVENIDOS</h1>
                <img
                    src="https://i.postimg.cc/4dsLbM1C/logo.jpg"
                    alt="Logo"
                    className="welcome-logo mt-5 img-fluid"
                />
                <br />
                <div className="loading-bar mt-3">
                    <div className="loading-bar-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
