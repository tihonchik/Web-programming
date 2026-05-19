import { getFromLocalStorage, setToLocalStorage } from "/js/localStotage.js";

function getCurrentTheme() {
  return getFromLocalStorage("theme") || "light";
}

function setTheme(theme) {
  setToLocalStorage("theme", theme);
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
  } else {
    document.body.classList.remove("theme-dark");
  }
}

function loadTheme() {
  const theme = getCurrentTheme();
  setTheme(theme);
}

export { getCurrentTheme, setTheme, loadTheme };
