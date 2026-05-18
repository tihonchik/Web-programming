function getFromLocalStorage(name) {
  return localStorage.getItem(name);
}

function setToLocalStorage(name, value) {
  return localStorage.setItem(name, value);
}

export { getFromLocalStorage, setToLocalStorage };
