import { cartService } from "./data/cart-service.js";

const drawerMarkup = `
  <button class="cart-drawer__backdrop" type="button" aria-label="장바구니 닫기" data-cart-backdrop></button>
  <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" aria-hidden="true" inert data-cart-panel>
    <header class="cart-drawer__header">
      <h2 id="cart-drawer-title">장바구니 담기</h2>
      <button class="cart-drawer__close" type="button" aria-label="장바구니 닫기" data-cart-close></button>
    </header>
    <div class="cart-drawer__content">
      <p class="cart-drawer__empty" data-cart-empty hidden>선택한 상품이 없습니다.</p>
      <ul class="cart-drawer__items" data-cart-items></ul>
    </div>
    <footer class="cart-drawer__footer">
      <p class="cart-drawer__total"><span>총 상품금액</span><strong data-cart-total>0원</strong></p>
      <a class="cart-drawer__go" data-cart-go>장바구니 이동</a>
    </footer>
    <p class="cart-drawer__error" role="alert" data-cart-error hidden></p>
  </aside>
`;

const layer = document.createElement("div");
layer.className = "cart-drawer-layer";
layer.dataset.cartLayer = "";
layer.hidden = true;
layer.innerHTML = drawerMarkup;
document.body.append(layer);

const panel = layer.querySelector("[data-cart-panel]");
const itemsContainer = layer.querySelector("[data-cart-items]");
const emptyMessage = layer.querySelector("[data-cart-empty]");
const totalElement = layer.querySelector("[data-cart-total]");
const errorElement = layer.querySelector("[data-cart-error]");
const openButtons = document.querySelectorAll("[data-cart-open]");
const closeButton = layer.querySelector("[data-cart-close]");
const backdrop = layer.querySelector("[data-cart-backdrop]");
const cartPageUrl = new URL("../pages/cart.html", import.meta.url);
const money = (amount) => `${amount.toLocaleString("ko-KR")}원`;
let isOpen = false;
let closeTimer;
let returnFocus;

layer.querySelector("[data-cart-go]").href = cartPageUrl.href;

function createCartItem(item) {
  const row = document.createElement("li");
  row.className = "cart-drawer__item";
  row.dataset.productId = item.productId;

  const image = document.createElement("img");
  image.className = "cart-drawer__image";
  image.src = new URL(`../${item.image}`, import.meta.url).href;
  image.alt = item.name;

  const details = document.createElement("div");
  details.className = "cart-drawer__details";
  const name = document.createElement("p");
  name.className = "cart-drawer__name";
  name.textContent = item.name;
  if (item.badge) {
    const badge = document.createElement("span");
    badge.className = "cart-drawer__badge";
    badge.textContent = item.badge;
    name.append(" ", badge);
  }

  const quantity = document.createElement("p");
  quantity.className = "cart-drawer__quantity";
  quantity.textContent = `수량 : ${item.quantity}`;
  const price = document.createElement("strong");
  price.className = "cart-drawer__price";
  price.textContent = money(item.price * item.quantity);
  const controls = document.createElement("div");
  controls.className = "cart-drawer__controls";
  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.dataset.cartQuantity = "-1";
  decrease.disabled = item.quantity === 1;
  decrease.setAttribute("aria-label", `${item.name} 수량 줄이기`);
  decrease.textContent = "−";
  const quantityValue = document.createElement("span");
  quantityValue.textContent = String(item.quantity);
  const increase = document.createElement("button");
  increase.type = "button";
  increase.dataset.cartQuantity = "1";
  increase.setAttribute("aria-label", `${item.name} 수량 늘리기`);
  increase.textContent = "+";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.cartRemove = "";
  remove.setAttribute("aria-label", `${item.name} 삭제`);
  remove.textContent = "삭제";
  controls.append(decrease, quantityValue, increase, remove);
  details.append(name, quantity, price, controls);
  row.append(image, details);
  return row;
}

async function renderCart() {
  errorElement.hidden = true;
  const items = await cartService.getAll();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = String(quantity);
    badge.hidden = quantity === 0;
  });
  openButtons.forEach((button) => {
    button.setAttribute("aria-label", quantity ? `장바구니 ${quantity}개 상품` : "장바구니");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  itemsContainer.replaceChildren(...items.map(createCartItem));
  emptyMessage.hidden = items.length > 0;
  totalElement.textContent = money(total);

  document.dispatchEvent(
    new CustomEvent("cart:rendered", {
      detail: { items, quantity, total },
    }),
  );
}

function showCartError(error) {
  errorElement.textContent = `장바구니를 불러오지 못했습니다. ${error.message}`;
  errorElement.hidden = false;
}

function openCart() {
  if (isOpen) return;
  isOpen = true;
  returnFocus = document.activeElement;
  openButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
  window.clearTimeout(closeTimer);
  layer.hidden = false;
  panel.inert = false;
  panel.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-cart-open");
  window.requestAnimationFrame(() => {
    if (!isOpen) return;
    layer.classList.add("is-open");
    closeButton.focus();
  });
}

function finishClose() {
  if (isOpen) return;
  layer.hidden = true;
  panel.inert = true;
  document.body.classList.remove("is-cart-open");
}

function closeCart() {
  if (!isOpen) return;
  isOpen = false;
  openButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
  layer.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  if (returnFocus instanceof HTMLElement) returnFocus.focus();
  window.clearTimeout(closeTimer);
  closeTimer = window.setTimeout(finishClose, 350);
}

async function refreshCart() {
  try {
    await renderCart();
  } catch (error) {
    showCartError(error);
    console.error(error);
  }
}

openButtons.forEach((button) => button.addEventListener("click", openCart));
closeButton.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
layer.addEventListener("transitionend", (event) => {
  if (event.target === panel && event.propertyName === "transform" && !isOpen) {
    window.clearTimeout(closeTimer);
    finishClose();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

layer.addEventListener("click", async (event) => {
  const quantityButton = event.target.closest("[data-cart-quantity]");
  const removeButton = event.target.closest("[data-cart-remove]");
  if (!quantityButton && !removeButton) return;

  const row = event.target.closest("[data-product-id]");
  if (!row) return;
  try {
    if (removeButton) {
      await cartService.remove(row.dataset.productId);
    } else {
      const currentItems = await cartService.getAll();
      const current = currentItems.find((item) => item.productId === row.dataset.productId);
      if (!current) throw new Error("장바구니 상품을 찾을 수 없습니다.");
      const nextQuantity = current.quantity + Number(quantityButton.dataset.cartQuantity);
      if (nextQuantity < 1) return;
      await cartService.setQuantity(current.productId, nextQuantity);
    }
    await renderCart();
  } catch (error) {
    showCartError(error);
    console.error(error);
  }
});

document.addEventListener("cart:updated", refreshCart);
window.addEventListener("storage", (event) => {
  if (event.key === "cartItems") refreshCart();
});
document.addEventListener("cart:open", openCart);
document.addEventListener("cart:close", closeCart);
refreshCart();
