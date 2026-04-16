class CatalogCard extends HTMLElement {
  constructor(good) {
    super();
    if (good) {
      this.render(good);
    }
  }

  render(good) {
    const { title, description, coast, photoURL, company, volume } = good;

    const formattedPrice =
      typeof coast === "number" ? `$${coast.toFixed(2)}` : coast;

    this.innerHTML = `
      <article class="catalog-card" data-category="${company.toLowerCase()}">
        <div class="catalog-card__image-wrapper">
          <img
            src="${photoURL}"
            alt="${title}"
            class="catalog-card__image"
          />
        </div>
        
        <div class="catalog-card__content">
          <div class="catalog-card__header">
            <!-- Используем title как название -->
            <h3 class="catalog-card__name H4">${title}</h3>
          </div>
          
          <p class="catalog-card__description SmallText">
            ${description}
          </p>
          <p class="catalog-card__description SmallText">
            ${volume}
          </p>
          
          <div class="catalog-card__footer">
            <span class="catalog-card__price H4">${formattedPrice}</span>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("catalog-card", CatalogCard);

export default CatalogCard;
