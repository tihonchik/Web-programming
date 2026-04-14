class MyHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<section class="top-header top-block">
        <div class="top-header__grid">
          <div class="empty"></div>
          <p class="header_text Smalltext">
            Free worldwide shipping for orders over $55. Shop now
          </p>
          <p class="header__close MaterialIcons">close</p>
        </div>
      </section>
      <section class="bottom-header top-block">
        <div class="bottom-header__grid">
          <div class="empty"></div>
          <nav class="header__nav">
            <a href="/pages/catalog.html" class="header__a Smalltext">Products</a>
            <a href="" class="header__a Smalltext">Story</a>
            <a href="" class="header__a Smalltext">Blog</a>
            <a href="" class="header__a Smalltext">Collections</a>
            <a href="" class="header__a Smalltext">Contact</a>
          </nav>
          <div class="header__buttons">
            <button class="header__left-button button">
              <p class="header__shoping_bag MaterialIcons">shopping_bag</p>
              <p class="Smalltext">Cart</p>
            </button>
            <button class="header__right-button button Smalltext">
              Subscribe
            </button>
          </div>
        </div>
      </section>`;
  }
}

customElements.define("my-header", MyHeader);
