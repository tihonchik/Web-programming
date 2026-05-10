import CatalogCard from "/components/CatalogCard.js";
import { GetGoods } from "/js/api.js";

const perPage = 8;
let currentPage = 1;
let pages = 0;

const detailModal = document.getElementById("detailModal");

function handleViewDetails(good) {
  if (detailModal) {
    detailModal.open("view", good);
  }
}

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
    var card = new CatalogCard(good, handleViewDetails);
    grid.appendChild(card);
  });
}

let currentCategory = [];
const categoryContainer = document.querySelector(".catalog_filter");
async function renderCategories() {
  const allGoods = (await GetGoods()).items;

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
  const items = respone.items;
  pages = respone.pages;
  const btns = document.querySelector(".buttons");
  if (pages) {
    btns.classList.remove("hidden");
  } else {
    btns.classList.add("hidden");
  }

  render(items);
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
