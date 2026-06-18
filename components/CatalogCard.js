import { AddToUserBasket, AddToUserFavorites } from "../js/api.js";
import { isAuthenticated, getCurrentUser } from "../js/auth.js";
import { notify } from "./MyToast.js";
import { getTranslation } from "../js/translation.js";

class CatalogCard extends HTMLElement {
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
    const basketBtn = this.querySelector(".add_to_basket");
    const favBtn = this.querySelector(".add_to_favorites");
    const article = this.querySelector(".catalog-card");

    if (basketBtn) {
      basketBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const user = getCurrentUser();
        if (user) {
          const success = await AddToUserBasket(user.id, this.good.id);
          if (success) {
            notify(
              await getTranslation("catalog.addedToBasketSuccess"),
              "success",
            );
          } else {
            notify(await getTranslation("catalog.addedToBasketError"), "error");
          }
        }
      });
    }

    if (favBtn) {
      favBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const user = getCurrentUser();
        if (user) {
          const success = await AddToUserFavorites(user.id, this.good.id);
          if (success) {
            notify(
              await getTranslation("catalog.addedToFavoritesSuccess"),
              "success",
            );
          } else {
            notify(
              await getTranslation("catalog.addedToFavoritesError"),
              "error",
            );
          }
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

    const buttons = isAuthenticated()
      ? `<button class="button add_to_basket" data-i18n="catalog.addToBasket">
           ${await getTranslation("catalog.addToBasket")}
         </button>
         <button class="button add_to_favorites" data-i18n="catalog.addToFavorites">
           ${await getTranslation("catalog.addToFavorites")}
         </button>`
      : "";

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
          ${buttons}
        </article>
    `;
  }
}

customElements.define("catalog-card", CatalogCard);

export default CatalogCard;
