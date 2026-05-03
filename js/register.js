import { GetGoods, AddGood } from "/js/api.js";

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
setupPasswordToggle("toggleConfirmPassword", "confirmPassword");

const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  if (!terms) {
    alert("Please accept the terms and conditions");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  try {
    const users = await GetGoods("users");

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      alert("Email already registered");
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
      alert("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/pages/login.html";
      }, 1500);
    } else {
      alert("Failed to create account. Please try again.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("An error occurred. Please try again.");
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
