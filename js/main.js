const promotion = document.querySelector("[data-promotion]");
const promotionClose = document.querySelector("[data-promotion-close]");

if (promotion && promotionClose) {
  promotionClose.addEventListener("click", () => {
    promotion.hidden = true;
  });
}
