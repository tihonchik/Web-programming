import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";
import GetGoods from "/js/api.js";

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

const input = document.querySelector(".catalog_input");
const searchField = document.querySelector(".catalog_select");
async function applyAllFilters() {
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;

  renderCatalog(await GetGoods(searchText, searchKey));
}
input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
