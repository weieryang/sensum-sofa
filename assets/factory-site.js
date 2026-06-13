(function () {
  "use strict";

  var header = document.querySelector("#site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector("#main-nav");
  var navigationLinks = navigation ? navigation.querySelectorAll("a") : [];

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigationLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true }
  );

  var revealItems = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  var year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  var filterButtons = document.querySelectorAll("[data-product-filter]");
  var productCards = document.querySelectorAll("[data-product-card]");
  var searchInput = document.querySelector("[data-product-search]");
  var resultCount = document.querySelector("[data-product-count]");
  var activeFilter = "all";

  if (window.location.hash && filterButtons.length) {
    var hashFilter = window.location.hash.slice(1);
    var hashButton = document.querySelector(
      '[data-product-filter="' + hashFilter + '"]'
    );
    if (hashButton) {
      activeFilter = hashFilter;
      filterButtons.forEach(function (candidate) {
        candidate.setAttribute(
          "aria-pressed",
          String(candidate === hashButton)
        );
      });
    }
  }

  function updateCatalog() {
    if (!productCards.length) return;

    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visibleCount = 0;

    productCards.forEach(function (card) {
      var category = card.getAttribute("data-category") || "";
      var searchText = card.getAttribute("data-search") || "";
      var categories = category.split(/\s+/).filter(Boolean);
      var matchesFilter =
        activeFilter === "all" || categories.indexOf(activeFilter) !== -1;
      var matchesSearch = !query || searchText.indexOf(query) !== -1;
      var isVisible = matchesFilter && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount + (visibleCount === 1 ? " family" : " families");
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.getAttribute("data-product-filter") || "all";
      filterButtons.forEach(function (candidate) {
        candidate.setAttribute(
          "aria-pressed",
          String(candidate === button)
        );
      });
      updateCatalog();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", updateCatalog);
  }

  updateCatalog();

  var chatState = "idle";

  function maximizeChat() {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
      window.Tawk_API.maximize();
      return true;
    }
    return false;
  }

  function loadLiveChat() {
    if (maximizeChat() || chatState === "loading") return;

    chatState = "loading";
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    var previousOnLoad = window.Tawk_API.onLoad;
    window.Tawk_API.onLoad = function () {
      chatState = "ready";
      if (typeof previousOnLoad === "function") previousOnLoad();
      maximizeChat();
    };

    var chatScript = document.createElement("script");
    chatScript.async = true;
    chatScript.src =
      "https://embed.tawk.to/6a290a6c8705f01c3509977d/1jqo51e13";
    chatScript.charset = "UTF-8";
    chatScript.setAttribute("crossorigin", "*");
    chatScript.onerror = function () {
      chatState = "failed";
      window.location.href = "/contact/?source=live-chat-unavailable";
    };
    document.head.appendChild(chatScript);
  }

  window.openLiveChat = function (event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
    loadLiveChat();
    return false;
  };
})();
