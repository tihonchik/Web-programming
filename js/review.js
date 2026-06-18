import { isAuthenticated, getCurrentUser } from "./auth.js";
import { AddReview } from "./api.js";
import { showError, hideError } from "./error.js";
import { notify } from "../components/MyToast.js";
import { getTranslation } from "./translation.js";

if (!isAuthenticated()) {
  window.location.href = "./login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");

if (!orderId) {
  window.location.href = "./orders.html";
}

let selectedRating = 0;

const stars = document.querySelectorAll(".star");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    selectedRating = parseInt(star.dataset.value);
    highlightStars(selectedRating);
    hideError("ratingError");
  });

  star.addEventListener("mouseenter", () => {
    const value = parseInt(star.dataset.value);
    highlightStars(value);
  });
});

document.querySelector(".rating-stars").addEventListener("mouseleave", () => {
  highlightStars(selectedRating);
});

function highlightStars(count) {
  stars.forEach((star, index) => {
    if (index < count) {
      star.textContent = "star";
      star.classList.add("active");
    } else {
      star.textContent = "star_border";
      star.classList.remove("active");
    }
  });
}

const reviewForm = document.getElementById("reviewForm");
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;

  if (selectedRating === 0) {
    showError(
      "ratingError",
      await getTranslation("review.errors.ratingRequired"),
    );
    isValid = false;
  } else {
    hideError("ratingError");
  }

  const comment = document.getElementById("comment").value.trim();
  if (!comment) {
    showError(
      "commentError",
      await getTranslation("review.errors.commentRequired"),
    );
    isValid = false;
  } else {
    hideError("commentError");
  }

  if (!isValid) {
    return;
  }

  const user = getCurrentUser();
  const review = {
    orderId: orderId,
    userId: user.id,
    rating: selectedRating,
    comment: comment,
    date: new Date().toISOString(),
  };

  const success = await AddReview(review);

  if (success) {
    notify(await getTranslation("review.submitSuccess"), "success");
    window.location.href = "./orders.html";
  } else {
    notify(await getTranslation("review.submitError"), "error");
  }
});
