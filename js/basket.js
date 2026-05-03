import { GetGoods, DeleteGood } from "/js/api.js";
import BasketCard from "/components/BasketCard.js";
import { isAuthenticated } from "/js/auth.js";

if (!isAuthenticated()) {
  window.location.href = "/pages/login.html";
}

const perPage = 8;
let currentPage = 1;
let pages = 0;
const type = "basket";

function render(list) {
  const grid = document.querySelector(`.catalog-grid`);
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
    var card = new BasketCard(good);
    grid.appendChild(card);
  });
}

window.addEventListener("favoritesUpdated", () => {
  applyAllFilters();
});

let currentCategory = [];
const categoryContainer = document.querySelector(".catalog_filter");
async function renderCategories() {
  const allGoods = await GetGoods(type);

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
const Sum = document.querySelector(".Sum");
async function applyAllFilters() {
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;
  const sort = sortField.value;
  const sortTyle = sortTypeField.value;

  const respone = await GetGoods(
    type,
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

  const sumCoast = items
    .reduce((acc, item) => {
      return acc + item.coast * item.count;
    }, 0)
    .toFixed(2);
  Sum.innerHTML = "All coast: " + sumCoast;

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

const buyBtn = document.querySelector(".Buy");
buyBtn.addEventListener("click", async () => {
  const items = await GetGoods("basket");
  await Promise.all(items.map((item) => DeleteGood("basket", item.id)));
  alert("Pass buy");
});

async function init() {
  await renderCategories();
  await applyAllFilters();
}

await init();
