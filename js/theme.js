import { getFromLocalStorage, setToLocalStorage } from "/js/localStotage.js";

let id = null;

function getCurrentTheme() {
  return getFromLocalStorage(`theme-${id}`) || "light";
}

function setTheme(theme, ID) {
  id = ID;
  setToLocalStorage(`theme-${id}`, theme);
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
  } else {
    document.body.classList.remove("theme-dark");
  }
}

function loadTheme(ID) {
  id = ID;
  const theme = getCurrentTheme();
  setTheme(theme, id);
}

export { getCurrentTheme, setTheme, loadTheme };
