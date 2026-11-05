import { cartService } from "../data/cart-service.js";

const itemsContainer = document.querySelector("[data-cart-page-items]");
const emptyMessage = document.querySelector("[data-cart-page-empty]");
const errorMessage = document.querySelector("[data-cart-page-error]");
const subtotalElement = document.querySelector("[data-cart-page-subtotal]");
const totalElement = document.querySelector("[data-cart-page-total]");
const money = (amount) => `${amount.toLocaleString("ko-KR")}원`;

function createItem(item) {
  const row = document.createElement("li");
  row.className = "cart-page__item";
  row.dataset.productId = item.productId;

  const select = document.createElement("input");
  select.className = "cart-page__select";
  select.type = "checkbox";
  select.checked = true;
  select.disabled = true;
  select.setAttribute("aria-label", `${item.name} 선택됨`);

  const image = document.createElement("img");
  image.className = "cart-page__image";
  image.src = new URL(`../../${item.image}`, import.meta.url).href;
  image.alt = item.name;

  const details = document.createElement("div");
  details.className = "cart-page__details";
  const name = document.createElement("p");
  name.className = "cart-page__name";
  name.textContent = item.name;
  if (item.badge) {
    const badge = document.createElement("span");
    badge.className = "cart-page__badge";
    badge.textContent = item.badge;
    name.append(" ", badge);
  }
  const price = document.createElement("p");
  price.className = "cart-page__unit-price";
  price.textContent = `${money(item.price)} / 개`;
  details.append(name, price);

  const quantity = document.createElement("div");
  quantity.className = "cart-page__quantity";
  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.dataset.cartPageQuantity = "-1";
  decrease.disabled = item.quantity === 1;
  decrease.setAttribute("aria-label", `${item.name} 수량 줄이기`);
  decrease.textContent = "−";
  const value = document.createElement("output");
  value.textContent = String(item.quantity);
  const increase = document.createElement("button");
  increase.type = "button";
  increase.dataset.cartPageQuantity = "1";
  increase.setAttribute("aria-label", `${item.name} 수량 늘리기`);
  increase.textContent = "+";
  quantity.append(decrease, value, increase);

  const sum = document.createElement("strong");
  sum.className = "cart-page__line-total";
  sum.textContent = money(item.price * item.quantity);

  const remove = document.createElement("button");
  remove.className = "cart-page__remove";
  remove.type = "button";
  remove.dataset.cartPageRemove = "";
  remove.setAttribute("aria-label", `${item.name} 삭제`);
  remove.textContent = "×";

  row.append(select, image, details, quantity, sum, remove);
  return row;
}

async function renderCartPage() {
  errorMessage.hidden = true;
  const items = await cartService.getAll();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 && subtotal < 20000 ? 2500 : 0;
  itemsContainer.replaceChildren(...items.map(createItem));
  emptyMessage.hidden = items.length > 0;
  subtotalElement.textContent = money(subtotal);
  document.querySelector("[data-cart-page-shipping]").textContent = money(shipping);
  totalElement.textContent = money(subtotal + shipping);
}

if (itemsContainer) {
  itemsContainer.addEventListener("click", async (event) => {
  const removeButton = event.target.closest("[data-cart-page-remove]");
  const quantityButton = event.target.closest("[data-cart-page-quantity]");
  if (!removeButton && !quantityButton) return;
  const row = event.target.closest("[data-product-id]");
  if (!row) return;

  try {
    if (removeButton) {
      await cartService.remove(row.dataset.productId);
    } else {
      const items = await cartService.getAll();
      const item = items.find((entry) => entry.productId === row.dataset.productId);
      if (!item) throw new Error("장바구니 상품을 찾을 수 없습니다.");
      const nextQuantity = item.quantity + Number(quantityButton.dataset.cartPageQuantity);
      if (nextQuantity < 1) return;
      await cartService.setQuantity(item.productId, nextQuantity);
    }
    await renderCartPage();
  } catch (error) {
    errorMessage.textContent = `장바구니를 변경하지 못했습니다. ${error.message}`;
    errorMessage.hidden = false;
    console.error(error);
  }
  });
}

document.addEventListener("cart:updated", () => {
  renderCartPage().catch((error) => {
    errorMessage.textContent = `장바구니를 불러오지 못했습니다. ${error.message}`;
    errorMessage.hidden = false;
    console.error(error);
  });
});

window.addEventListener("storage", (event) => {
  if (event.key !== "cartItems") return;
  renderCartPage().catch((error) => {
    errorMessage.textContent = `장바구니를 불러오지 못했습니다. ${error.message}`;
    errorMessage.hidden = false;
    console.error(error);
  });
});

renderCartPage().catch((error) => {
  errorMessage.textContent = `장바구니를 불러오지 못했습니다. ${error.message}`;
  errorMessage.hidden = false;
  console.error(error);
});
