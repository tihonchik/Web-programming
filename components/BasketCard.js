import { DeleteUserBasketItem, UpdateUserBasketItem } from "/js/api.js";
import { notify } from "/components/MyToast.js";
import { getTranslation } from "/js/translation.js";

class BasketCard extends HTMLElement {
  constructor(good, onView) {
    if (good) {
      super();
      this.good = good;
      this.onView = onView;
      this.render();
    }
  }

  connectedCallback() {
    this.initEvents();
  }

  async initEvents() {
    const removeBtn = this.querySelector(".remove_from_basket");
    const addCountBtn = this.querySelector(".add_count");
    const removeCountBtn = this.querySelector(".remove_count");
    const article = this.querySelector(".catalog-card");

    removeBtn.addEventListener("click", async () => {
      const success = await DeleteUserBasketItem(this.good.basketItemId);
      if (success) {
        notify(await getTranslation("basket.removedSuccess"), "success");
        window.dispatchEvent(new CustomEvent("basketUpdated"));
      } else {
        notify(await getTranslation("basket.removedError"), "error");
      }
    });

    addCountBtn.addEventListener("click", async () => {
      this.good.count += 1;
      const success = await UpdateUserBasketItem(this.good.basketItemId, this.good);
      if (success) {
        await this.updateCountDisplay();
      } else {
        notify(await getTranslation("basket.updateError"), "error");
      }
    });

    removeCountBtn.addEventListener("click", async () => {
      if (this.good.count > 1) {
        this.good.count -= 1;
        const success = await UpdateUserBasketItem(this.good.basketItemId, this.good);
        if (success) {
          await this.updateCountDisplay();
        } else {
          notify(await getTranslation("basket.updateError"), "error");
        }
      }
    });

    if (article) {
      article.style.cursor = "pointer";
      article.addEventListener("click", () => {
        if (this.onView) {
          this.onView(this.good);
        }
      });
    }
  }

  async updateCountDisplay() {
    const countElement = this.querySelector(".catalog-card__count");
    if (countElement) {
      countElement.textContent = `${await getTranslation("basket.count")}${this.good.count}`;
    }
  }

  async render() {
    const { id, title, description, coast, photoURL, company, volume, count } =
      this.good;

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
            <span class="catalog-card__count H4">${await getTranslation("basket.count")}${count}</span>
          </div>
          <button class="button remove_from_basket" data-i18n="basket.removeFromBasket">Remove from basket</button>
          <button class="button add_count" data-i18n="basket.addCount">add count</button>
          <button class="button remove_count" data-i18n="basket.removeCount">remove count</button>
        </article>
    `;
  }
}

customElements.define("basket-card", BasketCard);

export default BasketCard;
