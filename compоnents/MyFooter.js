class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="footer__content">
        <div class="footer__top-part">
          <div class="footer__left-part">
            <p class="footer__text Smalltext">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <div class="footer__text-box">
              <input type="text" class="footer__input" />
              <button class="footer__button button Smalltext">Subscribe</button>
            </div>
          </div>
          <div class="footer__right-part">
            <div class="footer__list">
              <p class="footer__item-title H5">Pages</p>
              <p class="footer__item Smalltext">Home</p>
              <p class="footer__item Smalltext">About</p>
              <p class="footer__item Smalltext">Contact</p>
              <p class="footer__item Smalltext">Blog</p>
              <p class="footer__item Smalltext">FAQs</p>
              <p class="footer__item Smalltext">Legal</p>
            </div>
            <div class="footer__list">
              <p class="footer__item-title H5">CMS Pages</p>
              <p class="footer__item Smalltext">Blog Post</p>
              <p class="footer__item Smalltext">Blog Categories</p>
              <p class="footer__item Smalltext">Product Page</p>
              <p class="footer__item Smalltext">Product Caregories</p>
            </div>
            <div class="footer__list">
              <p class="footer__item-title H5">Account Pages</p>
              <p class="footer__item Smalltext">Login</p>
              <p class="footer__item Smalltext">Sing Up</p>
              <p class="footer__item Smalltext">Forgot Password</p>
              <p class="footer__item Smalltext">Reset Password</p>
              <p class="footer__item Smalltext">Email Confirmation</p>
            </div>
            <div class="footer__list">
              <p class="footer__item-title H5">Utility Pages</p>
              <p class="footer__item Smalltext">Style Guide</p>
              <p class="footer__item Smalltext">Changelog</p>
              <p class="footer__item Smalltext">Licenses</p>
              <p class="footer__item Smalltext">404</p>
              <p class="footer__item Smalltext">Password</p>
            </div>
          </div>
        </div>
        <hr class="footer__line" />
        <div class="footer__bottom-part">
          <p class="footer__powered Smalltext">
            © Beautico by Minimal Square . Powered by Webflow .
          </p>
          <div class="footer__icons">
            <img
              src="./static/footer/Vector.png"
              alt="facebook"
              class="footer__icon"
            />
            <img
              src="./static/footer/Vector 1.png"
              alt="instagram"
              class="footer__icon"
            />
            <img
              src="./static/footer/Vector 2.png"
              alt="twitter"
              class="footer__icon"
            />
          </div>
        </div>
      </div>`;
  }
}

customElements.define("my-footer", MyFooter);
