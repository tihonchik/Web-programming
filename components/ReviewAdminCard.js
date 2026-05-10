class ReviewAdminCard {
  constructor(review, user, product, onDelete) {
    this.review = review;
    this.user = user;
    this.product = product;
    this.onDelete = onDelete;
  }

  render() {
    const row = document.createElement("tr");

    const userName = this.user
      ? `${this.user.firstName} ${this.user.lastName}`
      : "Unknown";
    const productTitle = this.product ? this.product.title : "Unknown";

    row.innerHTML = `
      <td>${this.review.id}</td>
      <td>${this.review.orderId}</td>
      <td>${userName}</td>
      <td>${productTitle}</td>
      <td>${"⭐".repeat(this.review.rating)}</td>
      <td>${this.review.comment}</td>
      <td>${new Date(this.review.date).toLocaleDateString()}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn delete" data-id="${this.review.id}">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </td>
    `;

    row.querySelector(".delete").addEventListener("click", () => {
      this.onDelete(this.review.id);
    });

    return row;
  }
}

export default ReviewAdminCard;
