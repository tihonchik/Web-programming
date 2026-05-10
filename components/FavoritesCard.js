import { DeleteUserFavoriteItem } from "/js/api.js";
import { notify } from "/components/MyToast.js";

class FavoritesCard extends HTMLElement {
  constructor(good, onView) {
    super();
    if (good) {
      this.good = good;
      this.onView = onView;
      this.render(good);
    }
  }

  connectedCallback() {
    this.initEvents();
  }

  initEvents() {
    const removeBtn = this.querySelector(".remove_from_favorites");
    const article = this.querySelector(".catalog-card");

    if (removeBtn) {
      removeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const success = await DeleteUserFavoriteItem(this.good.favoriteItemId);
        if (success) {
          notify("Removed from favorites!", "success");
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          notify("Failed to remove from favorites", "error");
        }
      });
    }

    if (article) {
      article.style.cursor = "pointer";
      article.addEventListener("click", () => {
        if (this.onView) {
          this.onView(this.good);
        }
      });
    }
  }

  render(good) {
    const { title, description, coast, photoURL, company, volume } = good;

    const formattedPrice =
      typeof coast === "number" ? `$${coast.toFixed(2)}` : coast;

    this.innerHTML = `
      <article class="catalog-card" data-category="${company.toLowerCase()}">
          <div class="catalog-card__image-wrapper">
            <img src="${photoURL}" alt="${title}" class="catalog-card__image" />
          </div>

          <div class="catalog-card__content">
            <div class="catalog-card__header">
              <h3 class="catalog-card__name H4">${title}</h3>
            </div>

            <p class="catalog-card__description SmallText">${description}</p>
            <p class="catalog-card__description SmallText">${volume}</p>

            <div class="catalog-card__footer">
              <span class="catalog-card__price H4">${formattedPrice}</span>
            </div>
          </div>
          <button class="button remove_from_favorites">Remove from favorites</button>
        </article>
    `;
  }
}

customElements.define("favorites-card", FavoritesCard);
export default FavoritesCard;
