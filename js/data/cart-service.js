import { storageHelper } from "./storage-helper.js";

const CART_KEY = "cartItems";

function isCartItem(item) {
  return (
    item &&
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    Number.isInteger(item.price) &&
    item.price >= 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

async function getCart() {
  const items = await storageHelper.get(CART_KEY, []);
  if (!Array.isArray(items) || !items.every(isCartItem)) {
    throw new Error("장바구니 저장 데이터 형식이 올바르지 않습니다.");
  }
  return items;
}

async function saveCart(items) {
  if (!Array.isArray(items) || !items.every(isCartItem)) {
    throw new TypeError("올바른 상품 정보만 장바구니에 저장할 수 있습니다.");
  }
  await storageHelper.set(CART_KEY, items);
  document.dispatchEvent(new CustomEvent("cart:updated"));
  return items;
}

export const cartService = {
  getAll: getCart,

  add: async (product, quantity = 1) => {
    if (
      !product ||
      typeof product.id !== "string" ||
      typeof product.name !== "string" ||
      typeof product.image !== "string" ||
      !Number.isInteger(product.price) ||
      product.price < 0 ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      throw new TypeError("상품 정보 또는 수량이 올바르지 않습니다.");
    }

    const items = await getCart();
    const existing = items.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        badge: typeof product.badge === "string" ? product.badge : "",
      });
    }
    return saveCart(items);
  },

  setQuantity: async (productId, quantity) => {
    if (typeof productId !== "string" || !Number.isInteger(quantity) || quantity < 1) {
      throw new TypeError("상품 식별자 또는 수량이 올바르지 않습니다.");
    }
    const items = await getCart();
    const item = items.find((entry) => entry.productId === productId);
    if (!item) throw new Error("수량을 변경할 장바구니 상품을 찾을 수 없습니다.");
    item.quantity = quantity;
    return saveCart(items);
  },

  remove: async (productId) => {
    if (typeof productId !== "string") {
      throw new TypeError("상품 식별자가 올바르지 않습니다.");
    }
    const items = await getCart();
    return saveCart(items.filter((item) => item.productId !== productId));
  },
};
