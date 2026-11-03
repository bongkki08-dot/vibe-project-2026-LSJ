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

const heroCarousel = document.querySelector("[data-hero-carousel]");

if (heroCarousel) {
  const slides = Array.from(heroCarousel.querySelectorAll("[data-hero-slide]"));
  const indicators = Array.from(
    document.querySelectorAll("[data-hero-indicator]")
  );
  const previousButton = heroCarousel.querySelector("[data-hero-previous]");
  const nextButton = heroCarousel.querySelector("[data-hero-next]");
  let activeIndex = slides.findIndex((slide) => !slide.hidden);

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
    });

    indicators.forEach((indicator, index) => {
      const isActive = index === activeIndex;
      indicator.classList.toggle("is-active", isActive);

      if (isActive) {
        indicator.setAttribute("aria-current", "true");
      } else {
        indicator.removeAttribute("aria-current");
      }
    });
  };

  if (slides.length > 0) {
    previousButton?.addEventListener("click", () => {
      showSlide(activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      showSlide(activeIndex + 1);
    });

    indicators.forEach((indicator) => {
      indicator.addEventListener("click", () => {
        showSlide(Number(indicator.dataset.heroIndicator));
      });
    });
  }
}
