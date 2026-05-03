import { GetGoods } from "/js/api.js";

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

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  try {
    const users = await GetGoods("users");

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      if (remember) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }

      alert("Login successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/pages/catalog.html";
      }, 1000);
    } else {
      alert("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
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
