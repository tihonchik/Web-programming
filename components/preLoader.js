class PreLoader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div class="loader"></div>';
    window.addEventListener("load", () => {
      this.classList.add("hide");
      setTimeout(() => {
        this.remove();
      }, 600);
    });
  }
}

customElements.define("pre-loader", PreLoader);

export default PreLoader;
