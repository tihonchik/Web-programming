import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";
import GetGoods from "/js/api.js";

const grid = document.querySelector(".catalog-grid");

function renderCatalog(list) {
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
    const card = new CatalogCard(good);
    grid.appendChild(card);
  });
}

let currentCategory = "";
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
    currentCategory = "";
    updateActiveButton(btnAll);
    applyAllFilters();
  });
  categoryContainer.appendChild(btnAll);

  uniqueCategories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.classList.add("button");

    btn.addEventListener("click", () => {
      currentCategory = category;
      updateActiveButton(btn);
      applyAllFilters();
    });

    categoryContainer.appendChild(btn);
  });
}

function updateActiveButton(clickedButton) {
  const buttons = categoryContainer.querySelectorAll("button");
  buttons.forEach((btn) => btn.classList.remove("active"));
  clickedButton.classList.add("active");
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

  renderCatalog(
    await GetGoods(searchText, searchKey, sort, sortTyle, currentCategory),
  );
}

input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
sortField.addEventListener("change", applyAllFilters);
sortTypeField.addEventListener("change", applyAllFilters);

async function init() {
  await renderCategories();
  await applyAllFilters();
}

await init();
