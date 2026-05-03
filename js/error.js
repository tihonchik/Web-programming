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

export { showError, hideError };
