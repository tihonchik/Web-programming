class MyToast extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="toast-container"></div>`;
    this.container = this.querySelector(".toast-container");

    window.addEventListener("show-toast", (e) => {
      const { message, type, duration } = e.detail;
      this.addToast(message, type, duration);
    });
  }

  addToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `toast-item ${type}`;

    const icon =
      type === "success" ? "check_circle" : type === "error" ? "error" : "info";

    toast.innerHTML = `
      <span class="material-icons">${icon}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => toast.classList.add("visible"), 10);

    setTimeout(() => {
      toast.classList.remove("visible");

      toast.addEventListener("transitionend", () => toast.remove());
    }, duration);
  }
}

customElements.define("my-toast", MyToast);

export const notify = (message, type = "info", duration = 3000) => {
  window.dispatchEvent(
    new CustomEvent("show-toast", {
      detail: { message, type, duration },
    }),
  );
};
