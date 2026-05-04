import { GetUserFavorites, GetUserFavoritesFiltered } from "/js/api.js";
import FavoritesCard from "/components/FavoritesCard.js";
import { isAuthenticated, getCurrentUser } from "/js/auth.js";

if (!isAuthenticated()) {
  window.location.href = "/pages/login.html";
}

const perPage = 8;
let currentPage = 1;
let pages = 0;

function render(list) {
  const grid = document.querySelector(`.catalog-grid`);
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No goods found</h3>
        <p>You haven't placed any orders yet.</p>
      </div>`;
    return;
  }

  list.forEach((good) => {
    var card = new FavoritesCard(good);
    grid.appendChild(card);
  });
}

window.addEventListener("favoritesUpdated", () => {
  applyAllFilters();
});

let currentCategory = [];
const categoryContainer = document.querySelector(".catalog_filter");
async function renderCategories() {
  const user = getCurrentUser();
  const allGoods = await GetUserFavorites(user.id);

  const uniqueCategories = new Set(allGoods.map((good) => good.category));

  categoryContainer.innerHTML = "";

  const btnAll = document.createElement("button");
  btnAll.textContent = "All";
  btnAll.classList.add("active");
  btnAll.classList.add("button");
  btnAll.addEventListener("click", () => {
    currentCategory = [];
    DiactivateButtons();
    applyAllFilters();
    btnAll.classList.add("active");
  });
  categoryContainer.appendChild(btnAll);

  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.classList.add("button");

    btn.addEventListener("click", () => {
      currentCategory.push(category);
      applyAllFilters();
      btn.classList.add("active");
      btnAll.classList.remove("active");
    });

    categoryContainer.appendChild(btn);
  });
}

function DiactivateButtons() {
  const buttons = categoryContainer.querySelectorAll("button");
  buttons.forEach((btn) => btn.classList.remove("active"));
}

const input = document.querySelector(".catalog_input");
const searchField = document.querySelector(".catalog_select");
const sortField = document.querySelector(".catalog_sort");
const sortTypeField = document.querySelector(".catalog_sort_type");
async function applyAllFilters() {
  const user = getCurrentUser();
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;
  const sort = sortField.value;
  const sortType = sortTypeField.value;

  const response = await GetUserFavoritesFiltered(
    user.id,
    searchText,
    searchKey,
    sort,
    sortType,
    currentCategory,
    perPage,
    currentPage,
  );

  let items;
  const btns = document.querySelector(".buttons");
  if (response.data) {
    items = response.data;
    pages = response.pages;
    btns.classList.remove("hidden");
  } else {
    items = response;
    btns.classList.add("hidden");
  }

  render(items, "catalog");
}

document.querySelector(".left").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    applyAllFilters();
  }
});

document.querySelector(".right").addEventListener("click", () => {
  if (pages > currentPage) {
    currentPage++;
    applyAllFilters();
  }
});

input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
sortField.addEventListener("change", applyAllFilters);
sortTypeField.addEventListener("change", applyAllFilters);

async function init() {
  await renderCategories();
  await applyAllFilters();
}

await init();
