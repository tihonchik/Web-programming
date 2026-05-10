import {
  GetGoods,
  AddGood,
  UpdateGood,
  DeleteGood,
  GetReviews,
  DeleteReview,
  GetUsers,
  GetUserOrders,
} from "/js/api.js";
import { isAuthenticated, isAdmin } from "/js/auth.js";
import BasketAdminCard from "/components/BasketAdminCard.js";
import { showError, hideError } from "/js/error.js";
import ReviewAdminCard from "/components/ReviewAdminCard.js";

if (!isAuthenticated() || !isAdmin()) {
  alert("Access denied. Admin only.");
  window.location.href = "/index.html";
}

let products = [];
let reviews = [];
let users = [];
let orders = [];
let editingProductId = null;

const modal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const productsTableBody = document.getElementById("productsTableBody");
const reviewsTableBody = document.getElementById("reviewsTableBody");

const tabBtns = document.querySelectorAll(".tab-btn");
const tabBtnProducts = document.getElementById("btn-products");
const tabBtnReviews = document.getElementById("btn-reviews");
const productsTab = document.getElementById("productsTab");
const reviewsTab = document.getElementById("reviewsTab");

tabBtnProducts.addEventListener("click", () => {
  tabBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
  tabBtnProducts.classList.add("active");
  productsTab.classList.add("active");
  reviewsTab.classList.remove("active");
  loadProducts();
});

tabBtnReviews.addEventListener("click", () => {
  tabBtns.forEach((btn) => {
    btn.classList.remove("active");
  });
  tabBtnReviews.classList.add("active");
  reviewsTab.classList.add("active");
  productsTab.classList.remove("active");
  loadReviews();
});

const filterType = document.getElementById("filterType");
const productFilterGroup = document.getElementById("productFilterGroup");
const userFilterGroup = document.getElementById("userFilterGroup");
const productFilter = document.getElementById("productFilter");
const userFilter = document.getElementById("userFilter");

filterType.addEventListener("change", () => {
  const type = filterType.value;

  productFilterGroup.classList.add("hidden");
  userFilterGroup.classList.add("hidden");

  if (type === "product") {
    productFilterGroup.classList.remove("hidden");
    loadProductsFilter();
  } else if (type === "user") {
    userFilterGroup.classList.remove("hidden");
    loadUsersFilter();
  }

  renderReviews();
});

productFilter.addEventListener("change", renderReviews);
userFilter.addEventListener("change", renderReviews);

addProductBtn.addEventListener("click", () => {
  openModal();
});

closeModal.addEventListener("click", closeModalWindow);

cancelBtn.addEventListener("click", closeModalWindow);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModalWindow();
  }
});

function openModal(product = null) {
  modal.classList.remove("hidden");

  if (product) {
    modalTitle.textContent = "Edit Product";
    editingProductId = product.id;
    document.getElementById("productId").value = product.id;
    document.getElementById("title").value = product.title;
    document.getElementById("description").value = product.description;
    document.getElementById("coast").value = product.coast;
    document.getElementById("photoURL").value = product.photoURL;
    document.getElementById("category").value = product.category;
    document.getElementById("company").value = product.company;
    document.getElementById("volume").value = product.volume;
  } else {
    modalTitle.textContent = "Add Product";
    editingProductId = null;
    productForm.reset();
  }
}

function closeModalWindow() {
  modal.classList.add("hidden");
  productForm.reset();
  editingProductId = null;
  clearErrors();
}

function clearErrors() {
  const fields = [
    "titleError",
    "descriptionError",
    "coastError",
    "photoURLError",
    "categoryError",
    "companyError",
    "volumeError",
  ];
  fields.forEach((field) => hideError(field));
}

const title = document.getElementById("title");
const description = document.getElementById("description");
const coast = document.getElementById("coast");
const photoURL = document.getElementById("photoURL");
const category = document.getElementById("category");
const company = document.getElementById("company");
const volume = document.getElementById("volume");

function checkTitle() {
  if (title.value.trim() === "") {
    showError("titleError", "Title is required");
    return false;
  }
  hideError("titleError");
  return true;
}

function checkDescription() {
  if (description.value.trim() === "") {
    showError("descriptionError", "Description is required");
    return false;
  }
  hideError("descriptionError");
  return true;
}

function checkCoast() {
  const value = parseFloat(coast.value);
  if (coast.value.trim() === "") {
    showError("coastError", "Price is required");
    return false;
  } else if (isNaN(value) || value <= 0) {
    showError("coastError", "Price must be a positive number");
    return false;
  }
  hideError("coastError");
  return true;
}

function checkPhotoURL() {
  if (photoURL.value.trim() === "") {
    showError("photoURLError", "Photo URL is required");
    return false;
  }
  hideError("photoURLError");
  return true;
}

function checkCategory() {
  if (category.value.trim() === "") {
    showError("categoryError", "Category is required");
    return false;
  }
  hideError("categoryError");
  return true;
}

function checkCompany() {
  if (company.value.trim() === "") {
    showError("companyError", "Company is required");
    return false;
  }
  hideError("companyError");
  return true;
}

function checkVolume() {
  if (volume.value.trim() === "") {
    showError("volumeError", "Volume is required");
    return false;
  }
  hideError("volumeError");
  return true;
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isTitleValid = checkTitle();
  const isDescValid = checkDescription();
  const isCoastValid = checkCoast();
  const isPhotoValid = checkPhotoURL();
  const isCatValid = checkCategory();
  const isCompValid = checkCompany();
  const isVolValid = checkVolume();

  const formIsValid =
    isTitleValid &&
    isDescValid &&
    isCoastValid &&
    isPhotoValid &&
    isCatValid &&
    isCompValid &&
    isVolValid;

  if (!formIsValid) {
    return;
  }

  const product = {
    title: title.value.trim(),
    description: description.value.trim(),
    coast: parseFloat(coast.value),
    photoURL: photoURL.value.trim(),
    category: category.value.trim(),
    company: company.value.trim(),
    volume: volume.value.trim(),
  };

  let success;
  if (editingProductId) {
    product.id = editingProductId;
    success = await UpdateGood(product);
  } else {
    success = await AddGood(product);
  }

  if (success) {
    closeModalWindow();
    await loadProducts();
  } else {
    alert("Failed to save product. Please try again.");
  }
});

title.addEventListener("input", checkTitle);
description.addEventListener("input", checkDescription);
coast.addEventListener("input", checkCoast);
photoURL.addEventListener("input", checkPhotoURL);
category.addEventListener("input", checkCategory);
company.addEventListener("input", checkCompany);
volume.addEventListener("input", checkVolume);

function renderProducts() {
  productsTableBody.innerHTML = "";

  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          No products found
        </td>
      </tr>
    `;
    return;
  }

  products.forEach((product) => {
    const card = new BasketAdminCard(product, openModal, handleDeleteProduct);
    productsTableBody.appendChild(card.render());
  });
}

async function loadProducts() {
  products = (await GetGoods()).items;
  renderProducts();
}

async function handleDeleteProduct(productId, productTitle) {
  if (confirm(`Are you sure you want to delete "${productTitle}"?`)) {
    const success = await DeleteGood(productId);
    if (success) {
      await loadProducts();
    } else {
      alert("Failed to delete product. Please try again.");
    }
  }
}

async function handleDeleteReview(reviewId) {
  if (confirm("Are you sure you want to delete this review?")) {
    const success = await DeleteReview(reviewId);
    if (success) {
      await loadReviews();
    } else {
      alert("Failed to delete review. Please try again.");
    }
  }
}

async function loadReviews() {
  reviews = await GetReviews();
  const allUsers = await GetUsers();
  users = allUsers;

  const allOrders = await Promise.all(
    users.map(async (user) => {
      const userOrders = await GetUserOrders(user.id);
      return userOrders;
    }),
  );
  orders = allOrders.flat();

  renderReviews();
}

function loadProductsFilter() {
  productFilter.innerHTML = '<option value="">All Products</option>';
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.title;
    productFilter.appendChild(option);
  });
}

function loadUsersFilter() {
  userFilter.innerHTML = '<option value="">All Users</option>';
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
    userFilter.appendChild(option);
  });
}

function renderReviews() {
  reviewsTableBody.innerHTML = "";

  let filteredReviews = [...reviews];

  const type = filterType.value;
  if (type === "product") {
    const productId = productFilter.value;
    if (productId) {
      const productOrders = orders.filter(
        (order) => order.goodId === productId,
      );
      const orderIds = productOrders.map((order) => order.id);
      filteredReviews = reviews.filter((review) =>
        orderIds.includes(review.orderId),
      );
    }
  } else if (type === "user") {
    const userId = userFilter.value;
    if (userId) {
      filteredReviews = reviews.filter((review) => review.userId === userId);
    }
  }

  if (filteredReviews.length === 0) {
    reviewsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          No reviews found
        </td>
      </tr>
    `;
    return;
  }

  filteredReviews.forEach((review) => {
    const user = users.find((u) => u.id === review.userId);
    const order = orders.find((o) => o.id === review.orderId);
    const product = products.find((p) => p.id === order?.goodId);
    const card = new ReviewAdminCard(review, user, product, handleDeleteReview);
    reviewsTableBody.appendChild(card.render());
  });
}

async function init() {
  await loadProducts();
  await loadReviews();
}

await init();
