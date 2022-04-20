import { ref } from 'vue';

export default function useTheme() {
    const currentTheme = ref(localStorage.getItem('theme') || 'light');

    if (process.isClient) {
        const themePreference = localStorage.getItem('theme');
        if (themePreference) {
            currentTheme.value = themePreference;
            currentTheme.value === 'light' ? setLightTheme() : setDarkTheme();
        }
    }

    function toggleTheme() {
        if (currentTheme.value === 'dark') {
            setLightTheme();
        } else {
            setDarkTheme();
        }
    }

    function setLightTheme() {
        currentTheme.value = 'light';
    
        document.documentElement.style.setProperty('--primary', 'var(--white)');
        document.documentElement.style.setProperty('--secondary', 'var(--black)');
    
        localStorage.setItem('theme', 'light'); // proccess.isClient checks if the current environment is a browser before storing current theme in localStorage
    }

    function setDarkTheme() {
        currentTheme.value = 'dark';

        document.documentElement.style.setProperty('--primary', 'var(--black)');
        document.documentElement.style.setProperty('--secondary', 'var(--white)');
    
        localStorage.setItem('theme', 'dark'); // proccess.isClient checks if the current environment is a browser before storing current theme in localStorage
    }

    return {
        currentTheme,
        toggleTheme,
    };
}