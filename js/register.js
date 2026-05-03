import { Register } from "/js/api.js";
import User from "/models/User.js";

function showError(id, message) {
  const error = document.getElementById(id);
  if (error) {
    error.textContent = message;
    error.style.display = "block";
  }
}

function hideError(id) {
  const error = document.getElementById(id);
  if (error) {
    error.textContent = "";
    error.style.display = "none";
  }
}

const registerForm = document.querySelector(".login-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const surname = document.getElementById("surname").value;
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("email").value;
  const number = document.getElementById("number").value;
  const birthday = document.getElementById("birthday").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  const newUser = new User(
    Date.now().toString(),
    firstName,
    lastName,
    surname,
    "user",
    email,
    number,
    birthday,
    password,
    nickname,
  );
});
