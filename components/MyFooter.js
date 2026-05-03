class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="footer__content">
        <hr class="footer__line" />
        <div class="footer__bottom-part">
          <p class="footer__powered Smalltext">
            © Beautico by Minimal Square . Powered by Webflow .
          </p>
          <div class="footer__icons">
            <img
              src="/static/footer/Vector.png"
              alt="facebook"
              class="footer__icon"
            />
            <img
              src="/static/footer/Vector 1.png"
              alt="instagram"
              class="footer__icon"
            />
            <img
              src="/static/footer/Vector 2.png"
              alt="twitter"
              class="footer__icon"
            />
          </div>
        </div>
      </div>`;
  }
}

customElements.define("my-footer", MyFooter);
