import { isAuthenticated, removeCurrentUser } from "/js/auth.js";

class MyHeader extends HTMLElement {
  connectedCallback() {
    const authButton = isAuthenticated()
      ? `<button class="header__right-button button Smalltext" id="logoutButton">
           Logout
         </button>`
      : `<a href="/pages/login.html" class="header__right-button button Smalltext">
           Login
         </a>`;

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
            <a href="/index.html" class="header__a Smalltext">Home</a>
            <a href="/pages/catalog.html" class="header__a Smalltext">Products</a>
            <a href="/pages/favorites.html" class="header__a Smalltext">Favorites</a>
            <a href="/pages/Basket.html" class="header__a Smalltext">Basket</a>
            <a href="/pages/orders.html" class="header__a Smalltext">Orders</a>
          </nav>
          <div class="header__buttons">
            <button class="header__left-button button">
              <p class="header__shoping_bag MaterialIcons">shopping_bag</p>
              <p class="Smalltext">Cart</p>
            </button>
            ${authButton}
          </div>
        </div>
      </section>`;

    if (isAuthenticated()) {
      const logoutButton = this.querySelector("#logoutButton");
      logoutButton.addEventListener("click", () => {
        removeCurrentUser();
        window.location.href = "/pages/login.html";
      });
    }
  }
}

customElements.define("my-header", MyHeader);
