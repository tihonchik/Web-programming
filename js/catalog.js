import Good from "/models/Good.js";
import CatalogCard from "/compоnents/CatalogCard.js";

const goods = [
  new Good(
    "Hydrating Face Cream",
    "A rich cream that deeply moisturizes and soothes dry skin.",
    34.99,
    "https://example.com/images/hydrating_face_cream.jpg",
    "Glow & Co.",
    "50 ml",
  ),
  new Good(
    "Vitamin C Serum",
    "Brightens skin and reduces signs of aging with antioxidants.",
    28.75,
    "https://example.com/images/vitamin_c_serum.jpg",
    "Pure Radiance",
    "30 ml",
  ),
  new Good(
    "Lipstick - Ruby Red",
    "Long-lasting matte lipstick in a classic red shade.",
    19.5,
    "https://example.com/images/lipstick_ruby_red.jpg",
    "Chic Cosmetics",
    "4 g",
  ),
  new Good(
    "Charcoal Face Mask",
    "Detoxifies and purifies pores for clearer skin.",
    16.99,
    "https://example.com/images/charcoal_mask.jpg",
    "Detox Essentials",
    "100 ml",
  ),
  new Good(
    "Eyelash Curler",
    "Gives lashes an instant lift and curl for a wide-eyed look.",
    12.49,
    "https://example.com/images/eyelash_curler.jpg",
    "Beauty Tools Pro",
    "One Size",
  ),
  new Good(
    "Nail Polish - Rose Gold",
    "Shimmering gold polish for a trendy nail look.",
    8.99,
    "https://example.com/images/nail_polish_rose_gold.jpg",
    "Mani Glam",
    "15 ml",
  ),
  new Good(
    "Anti-Aging Eye Cream",
    "Reduces puffiness and dark circles under the eyes.",
    24.95,
    "https://example.com/images/eye_cream.jpg",
    "Youth Lab",
    "15 ml",
  ),
  new Good(
    "Shea Butter Body Lotion",
    "Intensely nourishing lotion for soft and smooth skin.",
    18.25,
    "https://example.com/images/shea_butter_lotion.jpg",
    "Nature's Care",
    "250 ml",
  ),
  new Good(
    "Eyeshadow Palette - Natural Tones",
    "A versatile palette with neutral shades for everyday looks.",
    26.99,
    "https://example.com/images/eyeshadow_palette.jpg",
    "Artistry Makeup",
    "12 x 1.5g",
  ),
  new Good(
    "Facial Cleansing Brush",
    "Deep cleanses pores and removes makeup residue.",
    39.9,
    "https://example.com/images/cleansing_brush.jpg",
    "Tech Skin",
    "One Size",
  ),
  new Good(
    "Highlighter Stick",
    "Adds a luminous glow to cheekbones and face contours.",
    22.5,
    "https://example.com/images/highlighter_stick.jpg",
    "Glossy Glow",
    "4 g",
  ),
  new Good(
    "Exfoliating Scrub",
    "Removes dead skin cells and reveals a fresh complexion.",
    15.75,
    "https://example.com/images/exfoliating_scrub.jpg",
    "Skin Renewal Co.",
    "150 ml",
  ),
  new Good(
    "Mascara - Black Volume",
    "Adds volume and length to lashes for dramatic eyes.",
    17.99,
    "https://example.com/images/mascara_black.jpg",
    "Lash Queen",
    "8 ml",
  ),
  new Good(
    "Face Oil - Argan",
    "Natural oil to hydrate and restore skin's natural glow.",
    21.3,
    "https://example.com/images/argan_oil.jpg",
    "Organic Botanics",
    "30 ml",
  ),
  new Good(
    "Blush Compact - Peach",
    "A natural-looking blush for a healthy, rosy glow.",
    14.99,
    "https://example.com/images/blush_peach.jpg",
    "Soft Cheeks",
    "5 g",
  ),
];

const grid = document.querySelector(".catalog-grid");

function renderCatalog(list) {
  grid.innerHTML = "";

  list.forEach((good) => {
    const card = new CatalogCard(good);
    grid.appendChild(card);
  });
}

renderCatalog(goods);
