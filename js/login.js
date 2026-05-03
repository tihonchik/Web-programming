import { GetGoods, AddGood } from "/js/api.js";

const loginCard = document.querySelector(".login-card");
const registerCard = document.getElementById("registerCard");
const showRegisterBtn = document.getElementById("showRegister");
const showLoginBtn = document.getElementById("showLogin");

showRegisterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginCard.classList.add("hidden");
  registerCard.classList.add("active");
});

showLoginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerCard.classList.remove("active");
  loginCard.classList.remove("hidden");
});

function setupPasswordToggle(toggleBtnId, inputId) {
  const toggleBtn = document.getElementById(toggleBtnId);
  const input = document.getElementById(inputId);

  if (toggleBtn && input) {
    toggleBtn.addEventListener("click", () => {
      const type = input.type === "password" ? "text" : "password";
      input.type = type;

      const icon = toggleBtn.querySelector(".material-icons");
      icon.textContent = type === "password" ? "visibility_off" : "visibility";
    });
  }
}

setupPasswordToggle("togglePassword", "password");
setupPasswordToggle("toggleRegPassword", "regPassword");
setupPasswordToggle("toggleConfirmPassword", "regConfirmPassword");

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  try {
    const users = await GetGoods("users");

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }

      showSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/pages/catalog.html";
      }, 1500);
    } else {
      showError("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred. Please try again.");
  }
});

const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    showError("Please accept the terms and conditions");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters long");
    return;
  }

  try {
    const users = await GetGoods("users");

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      showError("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    const success = await AddGood("users", newUser);

    if (success) {
      showSuccessMessage("Account created successfully! Please sign in.");

      setTimeout(() => {
        registerCard.classList.remove("active");
        loginCard.classList.remove("hidden");
        registerForm.reset();
      }, 2000);
    } else {
      showError("Failed to create account. Please try again.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    showError("An error occurred. Please try again.");
  }
});

function showError(message) {
  alert(message);
}

function showSuccessMessage(message) {
  const existingMessage = document.querySelector(".success-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const successDiv = document.createElement("div");
  successDiv.className = "success-message show Smalltext";
  successDiv.textContent = message;

  const activeCard = registerCard.classList.contains("active")
    ? registerCard
    : loginCard;
  activeCard.insertBefore(successDiv, activeCard.firstChild);

  setTimeout(() => {
    successDiv.classList.remove("show");
    setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

function checkAuth() {
  const user =
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser");

  if (user) {
    window.location.href = "/pages/catalog.html";
  }
}

checkAuth();
