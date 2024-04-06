import { setItem } from './local-storage';

const changeTheme = (trigger, selector, theme) => {
    const triggerEl = document.querySelector(trigger);
    const selectorEl = document.querySelector(selector);

    triggerEl.addEventListener('click', () => {
        selectorEl.classList.toggle(theme);

        const themeAdded = selectorEl.classList.contains(theme);

        if (themeAdded) {
            setItem('theme', theme);
        } else {
            localStorage.removeItem('theme');
        }

    }); 
};

export {changeTheme};