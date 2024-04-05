function getItem(item) {
    return JSON.parse(localStorage.getItem(item));
}

function setItem(item, array) {
    localStorage.setItem(item, JSON.stringify(array));
}

export {getItem, setItem};