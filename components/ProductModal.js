import { showError, hideError } from "../js/error.js";
import { getTranslation } from "../js/translation.js";

class ProductModal extends HTMLElement {
  connectedCallback() {
    this.renderBase();
    this.modal = this.querySelector(".modal");
    this.modalTitle = this.querySelector("#modalTitle");
    this.modalBody = this.querySelector("#modalBody");

    this.querySelector("#closeModal").addEventListener("click", () =>
      this.close(),
    );
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  renderBase() {
    this.innerHTML = `
      <div class="modal hidden" id="innerModal">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h3 class="modal-title H3" id="modalTitle"></h3>
            <button class="modal-close" id="closeModal">
              <span class="material-icons">close</span>
            </button>
          </div>
          <div id="modalBody"></div>
        </div>
      </div>
    `;
  }

  async open(mode, product = null) {
    this.mode = mode;
    this.product = product;

    if (mode === "view") {
      this.modalTitle.setAttribute("data-i18n", "modal.productDetails");
      this.modalTitle.textContent = await getTranslation("modal.productDetails");
      this.renderViewMode();
    } else {
      const titleKey = mode === "edit" ? "modal.editProduct" : "modal.addProduct";
      this.modalTitle.setAttribute("data-i18n", titleKey);
      this.modalTitle.textContent = await getTranslation(titleKey);
      this.renderFormMode();
    }

    this.modal.classList.remove("hidden");
  }

  close() {
    this.modal.classList.add("hidden");
    this.modalBody.innerHTML = "";
    if (this.mode !== "view") {
      this.clearErrors();
    }
  }

  clearErrors() {
    const fields = [
      "titleError",
      "descriptionError",
      "coastError",
      "photoURLError",
      "categoryError",
      "companyError",
      "volumeError",
    ];
    fields.forEach((field) => hideError(field));
  }

  renderViewMode() {
    const p = this.product;
    this.modalBody.innerHTML = `
      <div style="display: flex; gap: var(--spacing-xl); align-items: flex-start; margin-top: var(--spacing-md);">
        <img src="${p.photoURL}" alt="${p.title}" style="width: 200px; height: 200px; object-fit: cover; border-radius: var(--radius-sm);">
        <div>
          <h4 class="H3" style="margin: 0 0 var(--gap-md) 0;">${p.title}</h4>
          <p class="SmallText" style="color: var(--colors-grey-800); margin-bottom: var(--gap-md);">${p.category} | ${p.company} | ${p.volume}</p>
          <p class="SmallText" style="margin-bottom: var(--spacing-md);">${p.description}</p>
          <div style="font-size: var(--fonts-sizes-24); font-weight: var(--fonts-weights-bold); color: var(--colors-text-title);">$${p.coast.toFixed(2)}</div>
        </div>
      </div>
    `;
  }

  renderFormMode() {
    const p = this.product || {};

    this.modalBody.innerHTML = `
      <form class="product-form" id="productForm">
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.title">Title</label>
          <input type="text" id="title" class="form-input SmallText" value="${p.title || ""}" />
          <span class="error-message SmallText" id="titleError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.description">Description</label>
          <textarea id="description" class="form-textarea SmallText" rows="3">${p.description || ""}</textarea>
          <span class="error-message SmallText" id="descriptionError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.price">Price</label>
          <input type="number" id="coast" class="form-input SmallText" step="0.01" min="0" value="${p.coast || ""}" />
          <span class="error-message SmallText" id="coastError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.photoURL">Photo URL</label>
          <input type="url" id="photoURL" class="form-input SmallText" value="${p.photoURL || ""}" />
          <span class="error-message SmallText" id="photoURLError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.category">Category</label>
          <input type="text" id="category" class="form-input SmallText" value="${p.category || ""}" />
          <span class="error-message SmallText" id="categoryError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.company">Company</label>
          <input type="text" id="company" class="form-input SmallText" value="${p.company || ""}" />
          <span class="error-message SmallText" id="companyError"></span>
        </div>
        <div class="form-group">
          <label class="form-label SmallText" data-i18n="modal.volume">Volume</label>
          <input type="text" id="volume" class="form-input SmallText" value="${p.volume || ""}" />
          <span class="error-message SmallText" id="volumeError"></span>
        </div>
        <div class="form-actions" style="margin-top: var(--spacing-xl);">
          <button type="button" class="button button-secondary" id="cancelBtn" data-i18n="modal.cancel">Cancel</button>
          <button type="submit" class="button" data-i18n="modal.save">Save</button>
        </div>
      </form>
    `;

    this.querySelector("#cancelBtn").addEventListener("click", () =>
      this.close(),
    );

    this.inputs = {
      title: this.querySelector("#title"),
      description: this.querySelector("#description"),
      coast: this.querySelector("#coast"),
      photoURL: this.querySelector("#photoURL"),
      category: this.querySelector("#category"),
      company: this.querySelector("#company"),
      volume: this.querySelector("#volume"),
    };

    this.inputs.title.addEventListener("input", () => this.checkTitle());
    this.inputs.description.addEventListener("input", () =>
      this.checkDescription(),
    );
    this.inputs.coast.addEventListener("input", () => this.checkCoast());
    this.inputs.photoURL.addEventListener("input", () => this.checkPhotoURL());
    this.inputs.category.addEventListener("input", () => this.checkCategory());
    this.inputs.company.addEventListener("input", () => this.checkCompany());
    this.inputs.volume.addEventListener("input", () => this.checkVolume());

    this.querySelector("#productForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      const isValid =
        await this.checkTitle() &
        await this.checkDescription() &
        await this.checkCoast() &
        await this.checkPhotoURL() &
        await this.checkCategory() &
        await this.checkCompany() &
        await this.checkVolume();

      if (!isValid) return;

      const productData = {
        title: this.inputs.title.value.trim(),
        description: this.inputs.description.value.trim(),
        coast: parseFloat(this.inputs.coast.value),
        photoURL: this.inputs.photoURL.value.trim(),
        category: this.inputs.category.value.trim(),
        company: this.inputs.company.value.trim(),
        volume: this.inputs.volume.value.trim(),
      };

      this.dispatchEvent(
        new CustomEvent("save", {
          detail: { productData, mode: this.mode, id: this.product?.id },
        }),
      );
    });
  }

  async checkTitle() {
    if (this.inputs.title.value.trim() === "") {
      showError("titleError", await getTranslation("modal.errors.titleRequired"));
      return false;
    }
    hideError("titleError");
    return true;
  }

  async checkDescription() {
    if (this.inputs.description.value.trim() === "") {
      showError("descriptionError", await getTranslation("modal.errors.descriptionRequired"));
      return false;
    }
    hideError("descriptionError");
    return true;
  }

  async checkCoast() {
    const value = parseFloat(this.inputs.coast.value);
    if (this.inputs.coast.value.trim() === "") {
      showError("coastError", await getTranslation("modal.errors.priceRequired"));
      return false;
    } else if (isNaN(value) || value <= 0) {
      showError("coastError", await getTranslation("modal.errors.pricePositive"));
      return false;
    }
    hideError("coastError");
    return true;
  }

  async checkPhotoURL() {
    if (this.inputs.photoURL.value.trim() === "") {
      showError("photoURLError", await getTranslation("modal.errors.photoURLRequired"));
      return false;
    }
    hideError("photoURLError");
    return true;
  }

  async checkCategory() {
    if (this.inputs.category.value.trim() === "") {
      showError("categoryError", await getTranslation("modal.errors.categoryRequired"));
      return false;
    }
    hideError("categoryError");
    return true;
  }

  async checkCompany() {
    if (this.inputs.company.value.trim() === "") {
      showError("companyError", await getTranslation("modal.errors.companyRequired"));
      return false;
    }
    hideError("companyError");
    return true;
  }

  async checkVolume() {
    if (this.inputs.volume.value.trim() === "") {
      showError("volumeError", await getTranslation("modal.errors.volumeRequired"));
      return false;
    }
    hideError("volumeError");
    return true;
  }
}

customElements.define("product-modal", ProductModal);
export default ProductModal;
