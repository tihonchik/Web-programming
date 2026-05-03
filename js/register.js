import { Register, GetUsers } from "/js/api.js";
import User from "/models/User.js";

const top100Passwords = [
  "password",
  "123456",
  "123456789",
  "guest",
  "QWERTY",
  "12345678",
  "111111",
  "12345",
  "col123456",
  "123123",
  "1234567",
  "1234",
  "1234567890",
  "000000",
  "555555",
  "666666",
  "123321",
  "654321",
  "7777777",
  "123",
  "d1lakiss",
  "777777",
  "110110jp",
  "1111",
  "987654321",
  "121212",
  "gizli",
  "abc123",
  "112233",
  "azerty",
  "159753",
  "1q2w3e4r",
  "54321",
  "admin@123",
  "222222",
  "qwertyuiop",
  "qwerty123",
  "qazwsx",
  "vip",
  "asdasd",
  "123qwe",
  "123654",
  "iloveyou",
  "a1b2c3",
  "999999",
  "Groupd2013",
  "1q2w3e",
  "usr",
  "Liman1000",
  "1111111",
  "333333",
  "123123123",
  "9136668099",
  "11111111",
  "1qaz2wsx",
  "password1",
  "mar20lt",
  "987654321",
  "gfhjkm",
  "159357",
  "abcd1234",
  "131313",
  "789456",
  "luzit2000",
  "aaaaaa",
  "zxcvbnm",
  "asdfghjkl",
  "1234qwer",
  "88888888",
  "dragon",
  "987654",
  "888888",
  "qwe123",
  "soccer",
  "3601",
  "asdfgh",
  "master",
  "samsung",
  "12345678910",
  "killer",
  "1237895",
  "1234561",
  "12344321",
  "daniel",
  "00000",
  "444444",
  "101010",
  "f–you",
  "qazwsxedc",
  "789456123",
  "super123",
  "qwer1234",
  "123456789a",
  "823477aA",
  "147258369",
  "unknown",
  "98765",
  "q1w2e3r4",
  "232323",
];

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

function generateRandomNickname() {
  const adjectives = [
    "Happy",
    "Lucky",
    "Swift",
    "Brave",
    "Clever",
    "Mighty",
    "Silent",
    "Golden",
    "Silver",
    "Dark",
    "Bright",
    "Wild",
    "Cool",
    "Epic",
    "Super",
    "Mega",
  ];

  const nouns = [
    "Tiger",
    "Dragon",
    "Eagle",
    "Wolf",
    "Fox",
    "Bear",
    "Lion",
    "Hawk",
    "Panda",
    "Ninja",
    "Warrior",
    "Knight",
    "Hunter",
    "Wizard",
    "Hero",
    "Legend",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);

  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const surname = document.getElementById("surname");
const nickname = document.getElementById("nickname");
nickname.value = generateRandomNickname();
const email = document.getElementById("email");
const number = document.getElementById("number");
const birthday = document.getElementById("birthday");
const checkbox = document.getElementById("terms");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

function CheckCheckBox() {
  if (checkbox.checked) {
    hideError("termsError");
    return true;
  } else {
    showError("termsError", "You must agree to the terms");
    return false;
  }
}

checkbox.addEventListener("input", CheckCheckBox);

function CheckFirstName() {
  if (firstName.value.trim() === "") {
    showError("firstNameError", "First name is required");
    return false;
  } else {
    hideError("firstNameError");
    return true;
  }
}
firstName.addEventListener("input", CheckFirstName);

function CheckLastName() {
  if (lastName.value.trim() === "") {
    showError("lastNameError", "Last name is required");
    return false;
  } else {
    hideError("lastNameError");
    return true;
  }
}
lastName.addEventListener("input", CheckLastName);

function CheckNickname() {
  if (nickname.value.trim() === "") {
    showError("nicknameError", "Nickname is required");
    return false;
  } else {
    hideError("nicknameError");
    return true;
  }
}
nickname.addEventListener("input", CheckNickname);

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

function CheckBirthday() {
  if (birthday.value === "") {
    showError("birthdayError", "Birthday is required");
    return false;
  } else {
    const birthDate = new Date(birthday.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (
      age < 16 ||
      (age === 16 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      showError("birthdayError", "You must be at least 16 years old");
      return false;
    } else {
      hideError("birthdayError");
      return true;
    }
  }
}
birthday.addEventListener("input", CheckBirthday);

function CheckConfirmPassword() {
  if (confirmPassword.value.trim() === "") {
    showError("confirmPasswordError", "Please confirm your password");
    return false;
  } else if (confirmPassword.value !== password.value) {
    showError("confirmPasswordError", "The passwords don't match");
    return false;
  } else {
    hideError("confirmPasswordError");
    return true;
  }
}
confirmPassword.addEventListener("input", CheckConfirmPassword);

function ValidatePassword(password) {
  const result = {
    success: true,
    message: "",
  };
  if (password.length < 8) {
    result.success = false;
    result.message = "The password must be at least 8 characters long.";
  } else if (password.length > 20) {
    result.success = false;
    result.message = "The password must be shorter than 21 characters.";
  } else if (!/\d/.test(password)) {
    result.success = false;
    result.message = "The password must contain at least one digit.";
  } else if (!/[A-Z]/.test(password)) {
    result.success = false;
    result.message = "The password must contain at least one uppercase letter.";
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.success = false;
    result.message =
      "The password must contain at least one special character.";
  } else if (top100Passwords.includes(password.toLowerCase())) {
    result.success = false;
    result.message =
      "This password is too common. Please choose a stronger password.";
  }
  return result;
}

function CheckPassword() {
  const result = ValidatePassword(password.value);
  if (result.success) {
    hideError("passwordError");
  } else {
    showError("passwordError", result.message);
  }
  return result.success;
}

password.addEventListener("input", CheckPassword);

function ValidateNumber(number) {
  const belarusPhoneRegex = /^\+375\d{9}$/;
  const result = {
    success: true,
    message: "",
  };
  if (!number || number.trim() === "") {
    result.success = false;
    result.message = "Phone number is required";
  } else if (!belarusPhoneRegex.test(number)) {
    result.success = false;
    result.message = "Format: +375XXXXXXXXX (9 digits after +375)";
  }
  return result;
}

function CheckNumber() {
  const result = ValidateNumber(number.value);
  if (result.success) {
    hideError("numberError");
  } else {
    showError("numberError", result.message);
  }
  return result.success;
}

number.addEventListener("input", CheckNumber);

const registerForm = document.querySelector(".login-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let success = true;
  if (!CheckCheckBox()) {
    success = false;
  }

  if (!CheckFirstName()) {
    success = false;
  }

  if (!CheckLastName()) {
    success = false;
  }

  if (!CheckNickname()) {
    success = false;
  }

  if (!CheckEmail()) {
    success = false;
  }

  if (!CheckBirthday()) {
    success = false;
  }

  if (!CheckPassword()) {
    success = false;
  }

  if (!CheckConfirmPassword()) {
    success = false;
  }

  if (!CheckNumber()) {
    success = false;
  }

  const users = await GetUsers();
  if (users.some((user) => user.nickname === nickname.value)) {
    showError("nicknameError", "Such a nickname already exists");
    success = false;
  }

  if (!success) {
    return;
  }

  const newUser = new User(
    Date.now().toString(),
    firstName.value,
    lastName.value,
    surname.value,
    "user",
    email.value,
    number.value,
    birthday.value,
    password.value,
    nickname.value,
  );

  alert(Register(newUser));
});
