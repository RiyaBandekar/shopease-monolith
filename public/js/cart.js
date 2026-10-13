// Client-side cart (stored in localStorage) + checkout submission.
const CART_KEY = "shopease_cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  updateCartBadge();
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const formatMoney = (n) => "₹" + Number(n).toFixed(2);
const cartTotal = (cart) => cart.reduce((s, i) => s + i.price * i.quantity, 0);

function updateCartBadge() {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return;
  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";
}

function addToCart(p) {
  const cart = getCart();
  const existing = cart.find((i) => String(i.id) === String(p.id));
  if (existing) existing.quantity += 1;
  else cart.push({ id: p.id, name: p.name, price: Number(p.price), image: p.image, quantity: 1 });
  saveCart(cart);
}
function removeFromCart(id) {
  saveCart(getCart().filter((i) => String(i.id) !== String(id)));
}
function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => String(i.id) === String(id));
  if (!item) return;
  item.quantity += delta;
  saveCart(item.quantity <= 0 ? cart.filter((i) => i !== item) : cart);
}

function bindAddToCartButtons() {
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart({
        id: btn.dataset.id, name: btn.dataset.name, price: btn.dataset.price, image: btn.dataset.image
      });
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check2"></i> Added!';
      btn.classList.replace("btn-dark", "btn-success");
      setTimeout(() => { btn.innerHTML = original; btn.classList.replace("btn-success", "btn-dark"); }, 900);
    });
  });
}

function renderCartPage() {
  const container = document.getElementById("cart-items-container");
  if (!container) return;
  const cart = getCart();
  document.getElementById("cart-empty-message").style.display = cart.length ? "none" : "block";
  document.getElementById("cart-content").style.display = cart.length ? "flex" : "none";
  if (!cart.length) return;

  container.innerHTML = cart.map((item) => `
    <div class="card mb-3 border-0 shadow-sm"><div class="card-body d-flex align-items-center gap-3 flex-wrap">
      <img src="${esc(item.image)}" class="cart-item-img" alt="${esc(item.name)}" />
      <div class="flex-grow-1"><h6 class="fw-semibold mb-1">${esc(item.name)}</h6>
        <p class="text-muted mb-0 small">${formatMoney(item.price)} each</p></div>
      <div class="d-flex align-items-center qty-control gap-2">
        <button class="btn btn-outline-secondary btn-sm" data-act="dec" data-id="${esc(item.id)}">-</button>
        <span class="fw-semibold">${item.quantity}</span>
        <button class="btn btn-outline-secondary btn-sm" data-act="inc" data-id="${esc(item.id)}">+</button>
      </div>
      <div class="text-end" style="min-width:90px"><p class="fw-bold mb-0">${formatMoney(item.price * item.quantity)}</p></div>
      <button class="btn btn-sm btn-outline-danger" data-act="del" data-id="${esc(item.id)}"><i class="bi bi-trash"></i></button>
    </div></div>`).join("");

  container.querySelectorAll("button[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const { act, id } = btn.dataset;
      if (act === "inc") changeQuantity(id, 1);
      else if (act === "dec") changeQuantity(id, -1);
      else removeFromCart(id);
      renderCartPage();
    });
  });

  const total = cartTotal(getCart());
  document.getElementById("cart-subtotal").textContent = formatMoney(total);
  document.getElementById("cart-total").textContent = formatMoney(total);
}

function renderCheckoutPage() {
  const container = document.getElementById("checkout-items-container");
  if (!container) return;
  const cart = getCart();
  document.getElementById("checkout-empty-message").style.display = cart.length ? "none" : "block";
  document.getElementById("checkout-content").style.display = cart.length ? "flex" : "none";
  if (!cart.length) return;

  container.innerHTML = cart.map((i) => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div><p class="mb-0 fw-semibold small">${esc(i.name)}</p>
        <p class="mb-0 text-muted small">Qty: ${i.quantity} x ${formatMoney(i.price)}</p></div>
      <p class="mb-0 fw-semibold">${formatMoney(i.price * i.quantity)}</p>
    </div>`).join("");

  const total = cartTotal(cart);
  document.getElementById("checkout-subtotal").textContent = formatMoney(total);
  document.getElementById("checkout-total").textContent = formatMoney(total);

  const form = document.getElementById("checkout-form");
  if (form && !form.dataset.bound) {
    form.dataset.bound = "1";
    form.addEventListener("submit", handleCheckoutSubmit);
  }
}

async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const errorBox = document.getElementById("checkout-error");
  const btn = document.getElementById("place-order-btn");
  errorBox.style.display = "none";

  const payload = {
    customerName: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
    paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
    items: getCart().map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
  };

  const fail = (msg) => {
    errorBox.textContent = msg; errorBox.style.display = "block";
    btn.disabled = false; btn.textContent = "Place Order";
  };
  if (!payload.items.length) return fail("Your cart is empty.");

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Placing Order...';
  try {
    const res = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) window.location.href = "/order-confirmation/" + data.orderId;
    else fail(data.message || "Something went wrong. Please try again.");
  } catch (err) {
    fail("Could not reach the server. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => { updateCartBadge(); bindAddToCartButtons(); });
