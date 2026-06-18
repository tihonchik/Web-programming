import { getTranslation } from "../js/translation.js";

class OrderCard extends HTMLElement {
  constructor(order, onView) {
    super();
    if (order) {
      this.order = order;
      this.onView = onView;
    }
  }

  async connectedCallback() {
    if (this.order) {
      await this.render();
      this.initEvents();
    }
  }

  initEvents() {
    const reviewBtn = this.querySelector(".leave_review");
    const article = this.querySelector(".catalog-card");

    if (reviewBtn) {
      reviewBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `./review.html?orderId=${this.order.id}`;
      });
    }

    if (article) {
      article.style.cursor = "pointer";
      article.addEventListener("click", () => {
        if (this.onView && this.order.good) {
          this.onView(this.order.good);
        }
      });
    }
  }

  async render() {
    const { id, userId, goodId, count, good } = this.order;

    const title = good ? good.title : `Order #${id}`;
    const photoURL = good ? good.photoURL : "";
    const description = good ? good.description : `Good ID: ${goodId}`;
    const volume = good ? good.volume : `Count: ${count}`;

    this.innerHTML = `
      <article class="catalog-card">
          <div class="catalog-card__image-wrapper">
            ${photoURL ? `<img src="${photoURL}" alt="${title}" class="catalog-card__image" />` : `<span class="material-icons order-icon">receipt</span>`}
          </div>

          <div class="catalog-card__content">
            <div class="catalog-card__header">
              <h3 class="catalog-card__name H4">${title}</h3>
            </div>

            <p class="catalog-card__description SmallText">${description}</p>
            <p class="catalog-card__description SmallText">${volume}</p>

            <div class="catalog-card__footer">
              <span class="catalog-card__price H4"></span>
            </div>
          </div>
          <button class="button leave_review" data-i18n="orders.leaveReview">
            ${await getTranslation("orders.leaveReview")}
          </button>
        </article>
    `;
  }
}

customElements.define("order-card", OrderCard);
export default OrderCard;
