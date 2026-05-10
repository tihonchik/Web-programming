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
import ReviewAdminCard from "/components/ReviewAdminCard.js";

if (!isAuthenticated() || !isAdmin()) {
  alert("Access denied. Admin only.");
  window.location.href = "/index.html";
}

let products = [];
let reviews = [];
let users = [];
let orders = [];

const appModal = document.getElementById("appModal");
const addProductBtn = document.getElementById("addProductBtn");
const productsTableBody = document.getElementById("productsTableBody");
const reviewsTableBody = document.getElementById("reviewsTableBody");

const tabBtns = document.querySelectorAll(".tab-btn");
const tabBtnProducts = document.getElementById("btn-products");
const tabBtnReviews = document.getElementById("btn-reviews");
const productsTab = document.getElementById("productsTab");
const reviewsTab = document.getElementById("reviewsTab");

const filterType = document.getElementById("filterType");
const productFilterGroup = document.getElementById("productFilterGroup");
const userFilterGroup = document.getElementById("userFilterGroup");
const productFilter = document.getElementById("productFilter");
const userFilter = document.getElementById("userFilter");

tabBtnProducts.addEventListener("click", () => {
  tabBtns.forEach((btn) => btn.classList.remove("active"));
  tabBtnProducts.classList.add("active");
  productsTab.classList.add("active");
  reviewsTab.classList.remove("active");
  loadProducts();
});

tabBtnReviews.addEventListener("click", () => {
  tabBtns.forEach((btn) => btn.classList.remove("active"));
  tabBtnReviews.classList.add("active");
  reviewsTab.classList.add("active");
  productsTab.classList.remove("active");
  loadReviews();
});

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
  appModal.open("add");
});

function handleEditProduct(product) {
  appModal.open("edit", product);
}

appModal.addEventListener("save", async (e) => {
  const { productData, mode, id } = e.detail;

  let success;
  if (mode === "edit") {
    productData.id = id;
    success = await UpdateGood(productData);
  } else {
    success = await AddGood(productData);
  }

  if (success) {
    appModal.close();
    await loadProducts();
  } else {
    alert("Failed to save product. Please try again.");
  }
});

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
    const card = new BasketAdminCard(
      product,
      handleEditProduct,
      handleDeleteProduct,
    );
    productsTableBody.appendChild(card.render());
  });
}

async function loadProducts() {
  products = (await GetGoods()).items;
  renderProducts();
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
