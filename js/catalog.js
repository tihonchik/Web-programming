import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";

const goods = [];

const newGood = new Good(
  "Blush Compact - Peach",
  "A natural-looking blush for a healthy, rosy glow.",
  14.99,
  "https://daplast.ru/local/cache/image/28/74/2483/banka-pet-kameliya-250-matovaya.jpg?v=1774619365",
  "Soft Cheeks",
  "5 g",
);

let displayedGoods = structuredClone(goods);

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

renderCatalog(goods);

const reset_button = document.querySelector(".reset-button");
reset_button.addEventListener("click", (e) => {
  renderCatalog(goods);
});

const first_button = document.querySelector(".first-button");
first_button.addEventListener("click", (e) => {
  const newGoods = displayedGoods.map((x) => x.addToCoast(x.coast));
  renderCatalog(newGoods);
});

const second_button = document.querySelector(".second-button");
second_button.addEventListener("click", (e) => {
  const newGoods = displayedGoods.filter((x) => x.coast > 1000);
  renderCatalog(newGoods);
});

const third_button = document.querySelector(".third-button");
third_button.addEventListener("click", (e) => {
  const newGoods = displayedGoods.sort((a, b) => a.coast - b.coast);
  renderCatalog(newGoods);
});

const fourth_button = document.querySelector(".fourth-button");
fourth_button.addEventListener("click", (e) => {
  const newGoods = displayedGoods.sort((a, b) => b.coast - a.coast);
  renderCatalog(newGoods);
});

const fiveth_button = document.querySelector(".fiveth-button");
fiveth_button.addEventListener("click", () => {
  const newGoods = displayedGoods.slice(0, -1);
  renderCatalog(newGoods);
});

const sixth_button = document.querySelector(".sixth-button");
sixth_button.addEventListener("click", () => {
  displayedGoods.push(newGood);
  renderCatalog(displayedGoods);
});

const seventh_button = document.querySelector(".seventh-button");
seventh_button.addEventListener("click", () => {
  const newGoods = displayedGoods.concat(displayedGoods);
  renderCatalog(newGoods);
});

const eight_button = document.querySelector(".eight-button");
eight_button.addEventListener("click", () => {
  const newGoods = [displayedGoods.find((x) => x.title.includes("Cream"))];
  renderCatalog(newGoods);
});

const nineth_button = document.querySelector(".nineth-button");
nineth_button.addEventListener("click", () => {
  const newGoods = displayedGoods.reverse();
  renderCatalog(newGoods);
});

const tenth_button = document.querySelector(".tenth-button");
tenth_button.addEventListener("click", () => {
  const newGoods = [...displayedGoods].sort(() => Math.random() - 0.5);
  renderCatalog(newGoods);
});

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
function applyAllFilters() {
  const searchText = input.value.toLowerCase();
  const searchKey = searchField.value;

  const filtered = goods.filter((item) => {
    const isCategoryMatch =
      currentCategory === "all" || item.category === currentCategory;

    const isSearchMatch = String(item[searchKey])
      .toLowerCase()
      .includes(searchText);

    return isCategoryMatch && isSearchMatch;
  });

  renderCatalog(filtered);
}
input.addEventListener("input", applyAllFilters);
searchField.addEventListener("change", applyAllFilters);
