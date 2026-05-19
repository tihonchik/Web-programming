import { Login } from "/js/api.js";
import { showError, hideError } from "/js/error.js";
import { setCurrentUser, isAuthenticated } from "/js/auth.js";
import { getCurentLang } from "/js/translation.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

let translations = null;

async function loadTranslations() {
  try {
    const response = await fetch("/i18n/translations.json");
    translations = await response.json();
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

function getTranslation(key) {
  if (!translations) return key;
  const lang = getCurentLang();
  const keys = key.split(".");
  const translatedText = keys.reduce((obj, k) => {
    return obj && obj[k] !== undefined ? obj[k] : null;
  }, translations[lang]);
  return translatedText || key;
}

function CheckEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    showError("emailError", getTranslation("login.errors.emailRequired"));
    return false;
  } else if (!emailRegex.test(email.value)) {
    showError("emailError", getTranslation("login.errors.emailInvalid"));
    return false;
  } else {
    hideError("emailError");
    return true;
  }
}

email.addEventListener("input", CheckEmail);

function CheckPassword() {
  if (password.value.trim() === "") {
    showError("passwordError", getTranslation("login.errors.passwordRequired"));
    return false;
  } else {
    hideError("passwordError");
    return true;
  }
}

password.addEventListener("input", CheckPassword);

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let success = true;

  if (!CheckEmail()) {
    success = false;
  }

  if (!CheckPassword()) {
    success = false;
  }

  if (!success) {
    return;
  }

  hideError("loginError");

  const user = await Login(email.value, password.value);

  if (user) {
    setCurrentUser(user);
    window.location.href = "/pages/catalog.html";
  } else {
    showError("loginError", getTranslation("login.errors.invalidCredentials"));
  }
});

function checkAuth() {
  if (isAuthenticated()) {
    window.location.href = "/pages/catalog.html";
  }
}

await loadTranslations();
checkAuth();
