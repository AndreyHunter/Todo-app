function getItem(key) {
	return JSON.parse(localStorage.getItem(key));
}

function setItem(key, elements) {
	localStorage.setItem(key, JSON.stringify(elements));
}

export { getItem, setItem };
