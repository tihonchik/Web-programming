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
import { notify } from "/components/MyToast.js";
import { getTranslation } from "/js/translation.js";

if (!isAuthenticated() || !isAdmin()) {
  notify(await getTranslation("admin.accessDenied"), "error");
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
    notify(await getTranslation("admin.products.savedSuccess"), "success");
  } else {
    notify(await getTranslation("admin.products.savedError"), "error");
  }
});

async function handleDeleteProduct(productId, productTitle) {
  const confirmMessage = (
    await getTranslation("admin.products.deleteConfirm")
  ).replace("{title}", productTitle);
  if (confirm(confirmMessage)) {
    const success = await DeleteGood(productId);
    if (success) {
      notify(await getTranslation("admin.products.deletedSuccess"), "success");
      await loadProducts();
    } else {
      notify(await getTranslation("admin.products.deletedError"), "error");
    }
  }
}

async function renderProducts() {
  productsTableBody.innerHTML = "";

  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          ${await getTranslation("admin.products.noProducts")}
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
  if (confirm(await getTranslation("admin.reviews.deleteConfirm"))) {
    const success = await DeleteReview(reviewId);
    if (success) {
      notify(await getTranslation("admin.reviews.deletedSuccess"), "success");
      await loadReviews();
    } else {
      notify(await getTranslation("admin.reviews.deletedError"), "error");
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

async function loadProductsFilter() {
  productFilter.innerHTML = `<option value="">${await getTranslation("admin.reviews.allProducts")}</option>`;
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.title;
    productFilter.appendChild(option);
  });
}

async function loadUsersFilter() {
  userFilter.innerHTML = `<option value="">${await getTranslation("admin.reviews.allUsers")}</option>`;
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    // Берем любое доступное поле фамилии
    const lastName = user.lastName || user.secondName || user.surname || "";
    option.textContent = `${user.firstName} ${lastName} (${user.email})`;
    userFilter.appendChild(option);
  });
}

async function renderReviews() {
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
          ${await getTranslation("admin.reviews.noReviews")}
        </td>
      </tr>
    `;
    return;
  }

  filteredReviews.forEach((review) => {
    const rawUser = users.find((u) => u.id === review.userId);

    // Создаем копию пользователя и принудительно задаем lastName из того, что есть в БД
    const user = rawUser
      ? {
          ...rawUser,
          lastName:
            rawUser.lastName || rawUser.secondName || rawUser.surname || "",
        }
      : null;

    // Ищем заказ (делаем проверку на случай, если review.orderId равен null)
    const order = review.orderId
      ? orders.find((o) => o.id === review.orderId)
      : null;

    // Ищем товар по заказу
    const product = order ? products.find((p) => p.id === order.goodId) : null;

    const card = new ReviewAdminCard(review, user, product, handleDeleteReview);
    reviewsTableBody.appendChild(card.render());
  });
}

async function init() {
  await loadProducts();
  await loadReviews();
}

await init();
