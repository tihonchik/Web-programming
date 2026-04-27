import CatalogCard from "/compоnents/CatalogCard.js";
import BasketCard from "/compоnents/BasketCard.js";
import GetGoods from "/js/api.js";
import storage from "/js/storage.js";
import FavoritesCard from "/compоnents/FavoritesCard.js";

const perPage = 3;
let currentPage = 1;
let pages = 0;

function render(list, type) {
  const grid = document.querySelector(`.${type}.catalog-grid`);
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
      </div>`;
    return;
  }

  list.forEach((good) => {
    if (type == "catalog") {
      var card = new CatalogCard(good);
    }
    if (type == "basket") {
      var card = new BasketCard(good);
    }
    if (type == "favorites") {
      var card = new FavoritesCard(good);
    }
    grid.appendChild(card);
  });
}

window.addEventListener("basketUpdated", () => {
  const basket = storage.get("basket");
  render(basket, "basket");
});

window.addEventListener("favoritesUpdated", () => {
  const favorites = storage.get("favorites");
  render(favorites, "favorites");
});

let currentCategory = [];
const categoryContainer = document.querySelector(".catalog_filter");
async function renderCategories() {
  const allGoods = await GetGoods();

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
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;
  const sort = sortField.value;
  const sortTyle = sortTypeField.value;

  const respone = await GetGoods(
    searchText,
    searchKey,
    sort,
    sortTyle,
    currentCategory,
    perPage,
    currentPage,
  );
  let items;
  const btns = document.querySelector(".buttons");
  if (respone.data) {
    items = respone.data;
    pages = respone.pages;
    btns.classList.remove("hidden");
  } else {
    items = respone;
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
  render(storage.get("basket"), "basket");
  render(storage.get("favorites"), "favorites");
}

await init();
