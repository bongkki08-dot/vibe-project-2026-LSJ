const promotion = document.querySelector("[data-promotion]");
const promotionClose = document.querySelector("[data-promotion-close]");

if (promotion && promotionClose) {
  promotionClose.addEventListener("click", () => {
    promotion.hidden = true;
  });
}

const sideMenuLayer = document.querySelector("[data-side-menu]");
const sideMenuPanel = document.querySelector("[data-side-menu-panel]");
const sideMenuOpenButton = document.querySelector("[data-side-menu-open]");
const sideMenuCloseButton = document.querySelector("[data-side-menu-close]");
const sideMenuBackdrop = document.querySelector("[data-side-menu-backdrop]");

if (
  sideMenuLayer &&
  sideMenuPanel &&
  sideMenuOpenButton &&
  sideMenuCloseButton &&
  sideMenuBackdrop
) {
  let isSideMenuOpen = false;
  let closeTimer;

  const finishClosing = () => {
    if (isSideMenuOpen) return;
    sideMenuLayer.hidden = true;
    sideMenuPanel.setAttribute("aria-hidden", "true");
    sideMenuPanel.inert = true;
    document.body.classList.remove("is-side-menu-open");
  };

  const closeSideMenu = () => {
    if (!isSideMenuOpen) return;

    isSideMenuOpen = false;
    sideMenuLayer.classList.remove("is-open");
    sideMenuPanel.setAttribute("aria-hidden", "true");
    sideMenuPanel.inert = true;
    sideMenuOpenButton.setAttribute("aria-expanded", "false");
    sideMenuOpenButton.focus();

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(finishClosing, 400);
  };

  const openSideMenu = () => {
    if (isSideMenuOpen) return;

    window.clearTimeout(closeTimer);
    isSideMenuOpen = true;
    sideMenuLayer.hidden = false;
    sideMenuPanel.inert = false;
    sideMenuPanel.setAttribute("aria-hidden", "false");
    sideMenuOpenButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("is-side-menu-open");

    window.requestAnimationFrame(() => {
      if (!isSideMenuOpen) return;
      sideMenuLayer.classList.add("is-open");
      sideMenuCloseButton.focus();
    });
  };

  sideMenuOpenButton.addEventListener("click", openSideMenu);
  sideMenuCloseButton.addEventListener("click", closeSideMenu);
  sideMenuBackdrop.addEventListener("click", closeSideMenu);

  sideMenuPanel.addEventListener("transitionend", (event) => {
    if (
      event.target === sideMenuPanel &&
      event.propertyName === "transform" &&
      !isSideMenuOpen
    ) {
      window.clearTimeout(closeTimer);
      finishClosing();
    }
  });

  sideMenuPanel.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSideMenu();
      return;
    }

    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      sideMenuPanel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.closest("[hidden]"));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  sideMenuPanel.querySelectorAll("[data-menu-accordion]").forEach((button) => {
    const controlledPanel = document.getElementById(
      button.getAttribute("aria-controls")
    );

    if (!controlledPanel) return;

    let panelCloseTimer;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const currentHeight = controlledPanel.getBoundingClientRect().height;

      window.clearTimeout(panelCloseTimer);
      controlledPanel.style.height = `${currentHeight}px`;
      controlledPanel.getBoundingClientRect();

      if (expanded) {
        button.setAttribute("aria-expanded", "false");
        controlledPanel.style.height = "0px";
        panelCloseTimer = window.setTimeout(() => {
          if (button.getAttribute("aria-expanded") === "false") {
            controlledPanel.hidden = true;
            controlledPanel.style.height = "";
          }
        }, 400);
        return;
      }

      controlledPanel.hidden = false;
      controlledPanel.style.height = "0px";
      controlledPanel.getBoundingClientRect();
      button.setAttribute("aria-expanded", "true");
      controlledPanel.style.height = `${controlledPanel.scrollHeight}px`;
    });

    controlledPanel.addEventListener("transitionend", (event) => {
      if (
        event.target === controlledPanel &&
        event.propertyName === "height"
      ) {
        window.clearTimeout(panelCloseTimer);
        if (button.getAttribute("aria-expanded") === "false") {
          controlledPanel.hidden = true;
        }
        controlledPanel.style.height = "";
      }
    });
  });
}

/* ==========================================================================
   Hero Banner Swiper Integration (5 Slides, Swipeable, Autoplay, Navigation)
   ========================================================================== */
if (typeof Swiper !== "undefined" && document.querySelector(".hero-swiper")) {
  const heroSwiper = new Swiper(".hero-swiper", {
    loop: true,
    speed: 600,
    grabCursor: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".hero__pagination",
      clickable: true,
    },
  });
}

/* ==========================================================================
   Floating Controls (Scroll to Top / Next Section)
   ========================================================================== */
const scrollTopBtn = document.querySelector("[data-scroll-top]");
const scrollDownBtn = document.querySelector("[data-scroll-down]");

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

scrollDownBtn?.addEventListener("click", () => {
  const productsSection = document.getElementById("products-section");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }
});


/* ==========================================================================
   Category Banners Interaction (Hover & Mobile Touch & Dots Slider)
   ========================================================================== */
const categoryTrack = document.querySelector("[data-category-track]");
const categoryItems = document.querySelectorAll(".category-item");
const categoryDots = document.querySelectorAll("[data-cat-dot]");

if (categoryTrack) {
  // Mobile touch: toggle / activate active class
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const wasActive = item.classList.contains("is-active");
      categoryItems.forEach((other) => other.classList.remove("is-active"));
      if (!wasActive) {
        item.classList.add("is-active");
      }
    });
  });

  // Mobile Dots Navigation
  if (categoryDots.length > 0) {
    categoryDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const maxScroll = categoryTrack.scrollWidth - categoryTrack.clientWidth;
        if (maxScroll <= 0) return;
        const targetScroll = (index / (categoryDots.length - 1)) * maxScroll;
        categoryTrack.scrollTo({ left: targetScroll, behavior: "smooth" });
      });
    });

    categoryTrack.addEventListener(
      "scroll",
      () => {
        const maxScroll = categoryTrack.scrollWidth - categoryTrack.clientWidth;
        if (maxScroll <= 0) return;
        const progress = categoryTrack.scrollLeft / maxScroll;
        const activeDotIndex = Math.min(
          categoryDots.length - 1,
          Math.max(0, Math.round(progress * (categoryDots.length - 1)))
        );
        categoryDots.forEach((dot, i) => {
          dot.classList.toggle("is-active", i === activeDotIndex);
        });
      },
      { passive: true }
    );
  }
}

/* ==========================================================================
   NEW & BEST Tabs Filtering
   ========================================================================== */
const productTabs = document.querySelectorAll("[data-filter-tab]");
const productCards = document.querySelectorAll(".product-card");
let currentFilter = "all";
let moreViewRevealed = false;

function applyProductFilter() {
  productCards.forEach((card) => {
    const isMoreItem = card.hasAttribute("data-more-item");
    const categories = (card.getAttribute("data-category") || "").split(" ");
    const matchesFilter =
      currentFilter === "all" || categories.includes(currentFilter);

    if (isMoreItem && !moreViewRevealed) {
      card.classList.add("is-hidden");
    } else if (matchesFilter) {
      card.classList.remove("is-hidden");
    } else {
      card.classList.add("is-hidden");
    }
  });
}

productTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    productTabs.forEach((t) => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    tab.classList.add("is-active");
    tab.setAttribute("aria-selected", "true");
    currentFilter = tab.getAttribute("data-filter-tab");
    applyProductFilter();
  });
});

/* ==========================================================================
   More View Button Click Handling
   ========================================================================== */
const moreViewButton = document.querySelector("[data-product-more]");

if (moreViewButton) {
  moreViewButton.addEventListener("click", () => {
    // 1. Immediately update button state to indicate click / hover color feedback
    moreViewButton.classList.add("is-active");

    // 2. On mobile / desktop, reveal additional 4 products with smooth transition
    window.setTimeout(() => {
      moreViewRevealed = true;
      applyProductFilter();

      // Smoothly hide the button once all additional products are displayed
      window.setTimeout(() => {
        moreViewButton.style.display = "none";
      }, 250);
    }, 150);
  });
}

/* ==========================================================================
   Right-side Page Indicator & Full-page Scroll Sync
   ========================================================================== */
const pageDots = document.querySelectorAll("[data-page-target]");
const sections = [
  document.getElementById("hero-section"),
  document.getElementById("products-section"),
].filter(Boolean);
const heroPagination = document.querySelector(".hero__pagination");

function updatePageIndicator() {
  const vh = window.innerHeight;
  let activePageIndex = 0;

  sections.forEach((sec, idx) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= vh * 0.4) {
      activePageIndex = idx;
    }
  });

  pageDots.forEach((dot, idx) => {
    dot.classList.toggle("is-active", idx === activePageIndex);
  });

  // When on Page 2 (products section), hide the hero bottom pagination
  if (heroPagination) {
    if (activePageIndex >= 1) {
      heroPagination.style.opacity = "0";
      heroPagination.style.pointerEvents = "none";
      heroPagination.style.transition = "opacity 0.3s ease";
    } else {
      heroPagination.style.opacity = "1";
      heroPagination.style.pointerEvents = "auto";
    }
  }
}

window.addEventListener("scroll", updatePageIndicator, { passive: true });
updatePageIndicator();

pageDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const targetIdx = Number(dot.getAttribute("data-page-target"));
    const targetSection = sections[targetIdx];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});