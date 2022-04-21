import { ref } from 'vue';

export default function useTheme() {
    const currentTheme = ref(localStorage.getItem('theme') || 'light');
    currentTheme.value === 'light' ? setLightTheme() : setDarkTheme();
    
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
    
        localStorage.setItem('theme', 'light');
    }

    function setDarkTheme() {
        currentTheme.value = 'dark';

        document.documentElement.style.setProperty('--primary', 'var(--black)');
        document.documentElement.style.setProperty('--secondary', 'var(--white)');
    
        localStorage.setItem('theme', 'dark');
    }

    return {
        currentTheme,
        toggleTheme
    };
}