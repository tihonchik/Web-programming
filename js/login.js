import { Login } from "/js/api.js";
import { showError, hideError } from "/js/error.js";
import { setCurrentUser, isAuthenticated } from "/js/auth.js";
import { getTranslation } from "/js/translation.js";

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

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

async function CheckEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    showError("emailError", await getTranslation("login.errors.emailRequired"));
    return false;
  } else if (!emailRegex.test(email.value)) {
    showError("emailError", await getTranslation("login.errors.emailInvalid"));
    return false;
  } else {
    hideError("emailError");
    return true;
  }
}

email.addEventListener("input", CheckEmail);

async function ValidatePassword(password) {
  const result = {
    success: true,
    message: "",
  };
  if (password.length < 8) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordTooShort");
  } else if (password.length > 20) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordTooLong");
  } else if (!/\d/.test(password)) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordNoDigit");
  } else if (!/[A-Z]/.test(password)) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordNoUppercase");
  } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordNoSpecial");
  } else if (top100Passwords.includes(password.toLowerCase())) {
    result.success = false;
    result.message = await getTranslation("register.errors.passwordTooCommon");
  }
  return result;
}

async function CheckPassword() {
  const result = await ValidatePassword(password.value);
  if (!result.success) {
    showError("passwordError", result.message);
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

  if (!(await CheckEmail())) {
    success = false;
  }

  if (!(await CheckPassword())) {
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
    showError("loginError", await getTranslation("login.errors.invalidCredentials"));
  }
});

function checkAuth() {
  if (isAuthenticated()) {
    window.location.href = "/pages/catalog.html";
  }
}

checkAuth();
