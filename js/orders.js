import OrderCard from "/components/OrderCard.js";
import { GetUserOrders } from "/js/api.js";
import { isAuthenticated, getCurrentUser } from "/js/auth.js";

if (!isAuthenticated()) {
  window.location.href = "/pages/login.html";
}

const detailModal = document.getElementById("detailModal");

function handleViewDetails(product) {
  if (detailModal && product) {
    detailModal.open("view", product);
  }
}

function render(list) {
  const grid = document.querySelector(`.catalog-grid`);
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No orders found</h3>
        <p>You haven't placed any orders yet.</p>
      </div>`;
    return;
  }

  list.forEach((order) => {
    var card = new OrderCard(order, handleViewDetails);
    grid.appendChild(card);
  });
}

async function loadOrders() {
  const user = getCurrentUser();
  const orders = await GetUserOrders(user.id);
  render(orders);
}

async function init() {
  await loadOrders();
}

await init();
