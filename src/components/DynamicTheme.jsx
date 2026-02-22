import { useEffect } from 'react';
import api from '../utils/api';

const DynamicTheme = () => {
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await api.get('/Website/settings');
                const settings = response.data;

                if (settings.primaryColor) {
                    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
                }
                if (settings.secondaryColor) {
                    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
                }
            } catch (error) {
                console.warn("Dynamic colors could not be loaded, using defaults.", error);
            }
        };

        fetchColors();
    }, []);

    return null; // This component doesn't render anything
};

export default DynamicTheme;
