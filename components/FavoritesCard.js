import { DeleteUserFavoriteItem } from "/js/api.js";
import { notify } from "/components/MyToast.js";
import { getTranslation } from "/js/translation.js";

class FavoritesCard extends HTMLElement {
  constructor(good, onView) {
    super();
    if (good) {
      this.good = good;
      this.onView = onView;
    }
  }

  async connectedCallback() {
    if (this.good) {
      await this.render();
      this.initEvents();
    }
  }

  initEvents() {
    const removeBtn = this.querySelector(".remove_from_favorites");
    const article = this.querySelector(".catalog-card");

    if (removeBtn) {
      removeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const success = await DeleteUserFavoriteItem(this.good.favoriteItemId);
        if (success) {
          notify(await getTranslation("favorites.removedSuccess"), "success");
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          notify(await getTranslation("favorites.removedError"), "error");
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

  async render() {
    const { title, description, coast, photoURL, company, volume } = this.good;

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
          <button class="button remove_from_favorites" data-i18n="favorites.removeFromFavorites">
            ${await getTranslation("favorites.removeFromFavorites")}
          </button>
        </article>
    `;
  }
}

customElements.define("favorites-card", FavoritesCard);
export default FavoritesCard;
