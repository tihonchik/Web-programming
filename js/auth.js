function getCurrentUser() {
  const userJson =
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser");
  return userJson ? JSON.parse(userJson) : null;
}

function setCurrentUser(user, remember = false) {
  if (remember) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
  }
}

function removeCurrentUser() {
  localStorage.removeItem("currentUser");
  sessionStorage.removeItem("currentUser");
}

function isAuthenticated() {
  return getCurrentUser() !== null;
}

export { getCurrentUser, setCurrentUser, removeCurrentUser, isAuthenticated };
