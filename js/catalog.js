import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";
import GetGoods from "/js/api.js";

let displayedGoods = [];

const grid = document.querySelector(".catalog-grid");

function renderCatalog(list) {
  grid.innerHTML = "";
  displayedGoods = list;

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

renderCatalog(await GetGoods());

const sort = document.querySelector(".catalog_sort");
sort.addEventListener("change", () => {
  if (sort.value == "asc") {
    displayedGoods.sort((a, b) => a.coast - b.coast);
  } else {
    displayedGoods.sort((a, b) => b.coast - a.coast);
  }
  renderCatalog(displayedGoods);
});

let currentCategory = "all";
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentCategory = btn.dataset.category;
    applyAllFilters();
  });
});

const input = document.querySelector(".catalog_input");
const searchField = document.querySelector(".catalog_select");
async function applyAllFilters() {
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;

  renderCatalog(await GetGoods(searchText, searchKey));
}
input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
