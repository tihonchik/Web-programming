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
import AdminCard from "/components/AdminCard.js";

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
const productsTab = document.getElementById("productsTab");
const reviewsTab = document.getElementById("reviewsTab");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.dataset.tab;

    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (tabName === "products") {
      productsTab.classList.add("active");
      reviewsTab.classList.remove("active");
    } else if (tabName === "reviews") {
      productsTab.classList.remove("active");
      reviewsTab.classList.add("active");
      loadReviews();
    }
  });
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

addProductBtn.addEventListener("click", openModal);

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

  validateForm();
}

function closeModalWindow() {
  modal.classList.add("hidden");
  productForm.reset();
  editingProductId = null;
  clearErrors();
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  errorElement.textContent = message;
  errorElement.classList.add("show");
  errorElement.style.display = "block";
}

function hideError(fieldId) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  errorElement.textContent = "";
  errorElement.classList.remove("show");
  errorElement.style.display = "none";
}

function clearErrors() {
  const fields = [
    "title",
    "description",
    "coast",
    "photoURL",
    "category",
    "company",
    "volume",
  ];
  fields.forEach((field) => hideError(field));
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const product = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    coast: parseFloat(document.getElementById("coast").value),
    photoURL: document.getElementById("photoURL").value.trim(),
    category: document.getElementById("category").value.trim(),
    company: document.getElementById("company").value.trim(),
    volume: document.getElementById("volume").value.trim(),
  };

  let isValid = true;

  if (!product.title) {
    showError("title", "Title is required");
    isValid = false;
  }

  if (!product.description) {
    showError("description", "Description is required");
    isValid = false;
  }

  if (!product.coast || product.coast <= 0) {
    showError("coast", "Price must be greater than 0");
    isValid = false;
  }

  if (!product.photoURL) {
    showError("photoURL", "Photo URL is required");
    isValid = false;
  }

  if (!product.category) {
    showError("category", "Category is required");
    isValid = false;
  }

  if (!product.company) {
    showError("company", "Company is required");
    isValid = false;
  }

  if (!product.volume) {
    showError("volume", "Volume is required");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  let success;
  if (editingProductId) {
    product.id = editingProductId;
    success = await UpdateGood("goods", product);
  } else {
    success = await AddGood("goods", product);
  }

  if (success) {
    closeModalWindow();
    await loadProducts();
  } else {
    alert("Failed to save product. Please try again.");
  }
});

function validateForm() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const coast = parseFloat(document.getElementById("coast").value);
  const photoURL = document.getElementById("photoURL").value.trim();
  const category = document.getElementById("category").value.trim();
  const company = document.getElementById("company").value.trim();
  const volume = document.getElementById("volume").value.trim();

  const isValid =
    title &&
    description &&
    coast > 0 &&
    photoURL &&
    category &&
    company &&
    volume;

  const submitBtn = productForm.querySelector('button[type="submit"]');
  submitBtn.disabled = !isValid;
}

document.getElementById("title").addEventListener("input", validateForm);
document.getElementById("description").addEventListener("input", validateForm);
document.getElementById("coast").addEventListener("input", validateForm);
document.getElementById("photoURL").addEventListener("input", validateForm);
document.getElementById("category").addEventListener("input", validateForm);
document.getElementById("company").addEventListener("input", validateForm);
document.getElementById("volume").addEventListener("input", validateForm);

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
    const card = new AdminCard(product, handleEdit, handleDelete);
    const row = card.render();
    productsTableBody.appendChild(row);
  });
}

function handleEdit(product) {
  openModal(product);
}

async function handleDelete(productId) {
  const success = await DeleteGood("goods", productId);
  if (success) {
    await loadProducts();
  } else {
    alert("Failed to delete product. Please try again.");
  }
}

async function loadProducts() {
  products = await GetGoods("goods");
  renderProducts();
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

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${review.id}</td>
      <td>${review.orderId}</td>
      <td>${user ? `${user.firstName} ${user.lastName}` : "Unknown"}</td>
      <td>${product ? product.title : "Unknown"}</td>
      <td>${"⭐".repeat(review.rating)}</td>
      <td>${review.comment}</td>
      <td>${new Date(review.date).toLocaleDateString()}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn delete" data-id="${review.id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </td>
    `;
    reviewsTableBody.appendChild(row);
  });

  document.querySelectorAll("#reviewsTableBody .delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const reviewId = btn.dataset.id;
      if (confirm("Are you sure you want to delete this review?")) {
        const success = await DeleteReview(reviewId);
        if (success) {
          await loadReviews();
        } else {
          alert("Failed to delete review. Please try again.");
        }
      }
    });
  });
}

async function init() {
  await loadProducts();
  await loadReviews();
}

await init();
