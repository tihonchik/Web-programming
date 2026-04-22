import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";

const goods = [
  new Good(
    "Hydrating Face Cream",
    "A rich cream that deeply moisturizes and soothes dry skin.",
    34.99,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZE9N1migHkVfIlBOZjDolUpq19gBODkQk8A&s",
    "Glow & Co.",
    "50 ml",
  ),
  new Good(
    "Vitamin C Serum",
    "Brightens skin and reduces signs of aging with antioxidants.",
    28.75,
    "https://images.prom.ua/6357933170_w1280_h640_6357933170.jpg",
    "Pure Radiance",
    "30 ml",
  ),
  new Good(
    "Lipstick - Ruby Red",
    "Long-lasting matte lipstick in a classic red shade.",
    19.5,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi0KGCBUKWJaK7BO41uYyWujfGDB6D3RPJmA&s",
    "Chic Cosmetics",
    "4 g",
  ),
  new Good(
    "Charcoal Face Mask",
    "Detoxifies and purifies pores for clearer skin.",
    16.99,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3QoduOBwIcQDqa_cFp6RMaM_G2uMYBW7cbQ&s",
    "Detox Essentials",
    "100 ml",
  ),
  new Good(
    "Eyelash Curler",
    "Gives lashes an instant lift and curl for a wide-eyed look.",
    12.49,
    "https://ir.ozone.ru/s3/multimedia-1-0/8570242944.jpg",
    "Beauty Tools Pro",
    "One Size",
  ),
  new Good(
    "Nail Polish - Rose Gold",
    "Shimmering gold polish for a trendy nail look.",
    8.99,
    "https://img.freepik.com/free-photo/skin-care-banner-concept-with-lotion_23-2149449093.jpg?semt=ais_hybrid&w=740&q=80",
    "Mani Glam",
    "15 ml",
  ),
  new Good(
    "Anti-Aging Eye Cream",
    "Reduces puffiness and dark circles under the eyes.",
    24.95,
    "https://u.makeup.com.ua/f/f4/f4qr9jrrwpnd.jpg",
    "Youth Lab",
    "15 ml",
  ),
  new Good(
    "Shea Butter Body Lotion",
    "Intensely nourishing lotion for soft and smooth skin.",
    18.25,
    "https://src.memorycode.ru/storage/app/public/35011/1686666888.jpg",
    "Nature's Care",
    "250 ml",
  ),
  new Good(
    "Eyeshadow Palette - Natural Tones",
    "A versatile palette with neutral shades for everyday looks.",
    26.99,
    "https://www.jarsking.com/wp-content/uploads/2026/02/Dragonfruit-Bloom-skincare-bottle-design.webp",
    "Artistry Makeup",
    "12 x 1.5g",
  ),
  new Good(
    "Facial Cleansing Brush",
    "Deep cleanses pores and removes makeup residue.",
    39.9,
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmj243oNv-EOjWNTEiXUp_y2uLn4TKDe2M0w&s",
    "Tech Skin",
    "One Size",
  ),
  new Good(
    "Highlighter Stick",
    "Adds a luminous glow to cheekbones and face contours.",
    22.5,
    "https://sun9-34.userapi.com/s/v1/ig2/DTf_R2-IWR_ZfsQP0qjF_kLYpDrziLxoiO-r_wFCscZxkPnPP4C5PWPjDVhIPuoQVus2zIdmYMJ9C0EENkIyyglB.jpg?quality=96&as=32x24,48x36,72x54,108x81,160x120,240x180,360x270,480x360,540x405,640x480,660x495&from=bu&cs=640x0",
    "Glossy Glow",
    "4 g",
  ),
  new Good(
    "Exfoliating Scrub",
    "Removes dead skin cells and reveals a fresh complexion.",
    15.75,
    "https://avatars.mds.yandex.net/get-mpic/16857451/2a00000198c78aaad65b77fdb9f738fef25d/orig",
    "Skin Renewal Co.",
    "150 ml",
  ),
  new Good(
    "Mascara - Black Volume",
    "Adds volume and length to lashes for dramatic eyes.",
    17.99,
    "https://image-thumbs.shafastatic.net/-869895963_310_430",
    "Lash Queen",
    "8 ml",
  ),
  new Good(
    "Face Oil - Argan",
    "Natural oil to hydrate and restore skin's natural glow.",
    21.3,
    "https://grominltd.com/media/jar-60-gromin-1.jpg",
    "Organic Botanics",
    "30 ml",
  ),
  new Good(
    "Blush Compact - Peach",
    "A natural-looking blush for a healthy, rosy glow.",
    14.99,
    "https://daplast.ru/local/cache/image/28/74/2483/banka-pet-kameliya-250-matovaya.jpg?v=1774619365",
    "Soft Cheeks",
    "5 g",
  ),
];

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

const input = document.querySelector(".catalog_input");
const searchField = document.querySelector(".catalog_select");
input.addEventListener("input", () => {
  const newGoods = goods.filter((x) => {
    const fieldValue = x[searchField.value];
    return String(fieldValue).toLowerCase().includes(input.value.toLowerCase());
  });
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
