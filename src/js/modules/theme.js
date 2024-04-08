import { setItem } from './local-storage';

const changeTheme = (trigger, selector, theme) => {
	const triggerEl = document.querySelector(trigger);
	const selectorEl = document.querySelector(selector);

	triggerEl.addEventListener('click', () => {
		selectorEl.classList.toggle(theme);
		triggerEl
			.querySelector('use')
			.setAttribute('href', './images/svgsprite/sprite.symbol.svg#sun');

		const themeAdded = selectorEl.classList.contains(theme);

		if (themeAdded) {
			setItem('theme', theme);
		} else {
			triggerEl
				.querySelector('use')
				.setAttribute('href', './images/svgsprite/sprite.symbol.svg#moon');
			localStorage.removeItem('theme');
		}
	});
};

export { changeTheme };
