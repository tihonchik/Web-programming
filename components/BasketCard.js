import { DeleteUserBasketItem, UpdateUserBasketItem } from "/js/api.js";

class BasketCard extends HTMLElement {
  constructor(good) {
    super();
    if (good) {
      this.render(good);
      this.good = good;
    }
  }

  connectedCallback() {
    this.initEvents();
  }

  initEvents() {
    const removeBtn = this.querySelector(".remove_from_basket");
    const addCountBtn = this.querySelector(".add_count");
    const removeCountBtn = this.querySelector(".remove_count");

    removeBtn.addEventListener("click", async () => {
      await DeleteUserBasketItem(this.good.basketItemId);
      window.dispatchEvent(new CustomEvent("basketUpdated"));
    });

    addCountBtn.addEventListener("click", async () => {
      this.good.count += 1;
      await UpdateUserBasketItem(this.good.basketItemId, this.good);
      this.updateCountDisplay();
    });

    removeCountBtn.addEventListener("click", async () => {
      if (this.good.count > 1) {
        this.good.count -= 1;
        await UpdateUserBasketItem(this.good.basketItemId, this.good);
        this.updateCountDisplay();
      }
    });
  }

  updateCountDisplay() {
    const countElement = this.querySelector(".catalog-card__count");
    if (countElement) {
      countElement.textContent = `Count:${this.good.count}`;
    }
  }

  render(good) {
    const { id, title, description, coast, photoURL, company, volume, count } =
      good;

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
            <span class="catalog-card__count H4">Count:${count}</span>
          </div>
          <button class="button remove_from_basket">Remove from basket</button>
          <button class="button add_count">add count</button>
          <button class="button remove_count">remove count</button>
        </article>
    `;
  }
}

customElements.define("basket-card", BasketCard);

export default BasketCard;
