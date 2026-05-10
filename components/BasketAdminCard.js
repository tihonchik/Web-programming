class BasketAdminCard {
  constructor(product, onEdit, onDelete) {
    if (product && onEdit && onDelete) {
      this.product = product;
      this.onEdit = onEdit;
      this.onDelete = onDelete;
    }
  }

  render() {
    const { id, photoURL, title, description, coast, category, volume } =
      this.product;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td><img src="${photoURL}" alt="${title}" class="product-image" /></td>
      <td>${title}</td>
      <td>${description}</td>
      <td>$${coast.toFixed(2)}</td>
      <td>${category}</td>
      <td>${volume}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" data-id="${id}">
            <span class="material-icons">edit</span>
          </button>
          <button class="action-btn delete" data-id="${id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </td>`;

    const editBtn = row.querySelector(".edit");
    const deleteBtn = row.querySelector(".delete");

    editBtn.addEventListener("click", () => {
      this.onEdit(this.product);
    });

    deleteBtn.addEventListener("click", async () => {
      this.onDelete(this.product.id);
    });

    return row;
  }
}

export default BasketAdminCard;
