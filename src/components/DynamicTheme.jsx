import { useEffect } from 'react';
import api from '../utils/api';

const DynamicTheme = () => {
    useEffect(() => {
        const fetchColors = async () => {
            try {
                const response = await api.get('/Website/settings');
                const settings = response.data;

                const primary = settings.primaryColor || settings.PrimaryColor;
                const secondary = settings.secondaryColor || settings.SecondaryColor;

                if (primary) {
                    document.documentElement.style.setProperty('--primary-color', primary);
                }
                if (secondary) {
                    document.documentElement.style.setProperty('--secondary-color', secondary);
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
