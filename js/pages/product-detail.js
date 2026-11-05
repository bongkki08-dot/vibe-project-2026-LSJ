import { cartService } from "../data/cart-service.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const productsUrl = new URL("../../data/products.json", import.meta.url);
const layout = document.querySelector("[data-product-detail]");
const loadError = document.querySelector("[data-product-load-error]");

if (layout && loadError) {
  try {
    const response = await fetch(productsUrl);
    if (!response.ok) {
      throw new Error(`상품 데이터를 불러오지 못했습니다. (${response.status})`);
    }

    const products = await response.json();
    const product = products.find((entry) => entry.id === productId);
    if (!product) throw new Error("요청한 상품을 찾을 수 없습니다.");

    const imageUrl = new URL(`../../${product.image}`, import.meta.url).href;
    const quantityOutput = document.querySelector("[data-product-quantity]");
    const totalOutput = document.querySelector("[data-product-total]");
    const errorOutput = document.querySelector("[data-product-error]");
    const addButton = document.querySelector("[data-cart-add]");
    let quantity = 1;
    const money = (amount) => `${amount.toLocaleString("ko-KR")}원`;

    document.title = `${product.name} | 더랩 바이 블랑두`;
    document.querySelector("[data-product-name]").textContent = product.name;
    document.querySelector("[data-product-price]").textContent = money(product.price);
    const image = document.querySelector("[data-product-image]");
    image.src = imageUrl;
    image.alt = product.name;
    const thumbnail = document.querySelector("[data-product-thumbnail]");
    thumbnail.src = imageUrl;
    thumbnail.alt = `${product.name} 미리보기`;

    if (product.badge) {
      const badge = document.querySelector("[data-product-badge]");
      badge.textContent = product.badge;
      badge.hidden = false;
    }
    if (Number.isInteger(product.originalPrice)) {
      const originalPrice = document.querySelector("[data-product-original]");
      originalPrice.textContent = money(product.originalPrice);
      originalPrice.hidden = false;
    }
    if (Number.isInteger(product.discount)) {
      const discount = document.querySelector("[data-product-discount]");
      discount.textContent = `${product.discount}%`;
      discount.hidden = false;
    }

    const updateQuantity = () => {
      quantityOutput.value = String(quantity);
      quantityOutput.textContent = String(quantity);
      totalOutput.textContent = money(product.price * quantity);
    };

    document.querySelector("[data-quantity-decrease]").addEventListener("click", () => {
      quantity = Math.max(1, quantity - 1);
      updateQuantity();
    });
    document.querySelector("[data-quantity-increase]").addEventListener("click", () => {
      quantity += 1;
      updateQuantity();
    });
    addButton.addEventListener("click", async () => {
      addButton.disabled = true;
      errorOutput.hidden = true;
      try {
        await cartService.add(product, quantity);
        document.dispatchEvent(new CustomEvent("cart:open"));
      } catch (error) {
        errorOutput.textContent = `장바구니에 담지 못했습니다. ${error.message}`;
        errorOutput.hidden = false;
        console.error(error);
      } finally {
        addButton.disabled = false;
      }
    });

    updateQuantity();
    layout.hidden = false;
  } catch (error) {
    loadError.textContent = error.message;
    loadError.hidden = false;
    console.error(error);
  }
}
