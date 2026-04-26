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

renderCatalog(await GetGoods());

const input = document.querySelector(".catalog_input");
const searchField = document.querySelector(".catalog_select");
const sortField = document.querySelector(".catalog_sort");
const sortTypeField = document.querySelector(".catalog_sort_type");
async function applyAllFilters() {
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;
  const sort = sortField.value;
  const sortTyle = sortTypeField.value;
  console.log(searchKey);
  console.log("fff");

  renderCatalog(await GetGoods(searchText, searchKey, sort, sortTyle));
}
input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
sortField.addEventListener("change", applyAllFilters);
sortTypeField.addEventListener("change", applyAllFilters);
