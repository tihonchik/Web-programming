class MyFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="footer__content reveal-element">
        <hr class="footer__line" />
        <div class="footer__bottom-part">
          <p class="footer__powered Smalltext" data-i18n="footer.copyright">
            © Beautico by Minimal Square . Powered by Webflow .
          </p>
          <div class="footer__icons">
            <img src="/static/footer/Vector.png" alt="facebook" class="footer__icon" />
            <img src="/static/footer/Vector 1.png" alt="instagram" class="footer__icon" />
            <img src="/static/footer/Vector 2.png" alt="twitter" class="footer__icon" />
          </div>
        </div>
      </div>`;

    this.initScrollAnimation();
  }

  initScrollAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(this);
  }
}

customElements.define("my-footer", MyFooter);
