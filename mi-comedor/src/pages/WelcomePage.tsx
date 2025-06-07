import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeContent from '../components/welcome/Welcome';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login'); // Cambia '/login' por la ruta de tu vista de login
        }, 5000); // 10 segundos

        return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
    }, [navigate]);

    return <WelcomeContent />;
};

export default WelcomePage;