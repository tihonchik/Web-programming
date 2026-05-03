import { Login } from "/js/api.js";
import { showError, hideError } from "/js/error.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

function CheckEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    showError("emailError", "Email is required");
    return false;
  } else if (!emailRegex.test(email.value)) {
    showError("emailError", "Please enter a valid email address");
    return false;
  } else {
    hideError("emailError");
    return true;
  }
}

email.addEventListener("input", CheckEmail);

function CheckPassword() {
  if (password.value.trim() === "") {
    showError("passwordError", "Password is required");
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
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    window.location.href = "/pages/catalog.html";
  } else {
    showError("loginError", "Invalid email or password");
  }
});

function checkAuth() {
  const user =
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser");

  if (user) {
    window.location.href = "/pages/catalog.html";
  }
}

checkAuth();
