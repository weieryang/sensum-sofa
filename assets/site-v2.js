(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".site-menu-toggle");

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    header.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  var path = window.location.pathname.replace(/index\.html$/, "");
  document.querySelectorAll(".site-primary-nav a").forEach(function (link) {
    var href = new URL(link.href, window.location.origin).pathname;
    if (href !== "/" && path.indexOf(href) === 0) {
      link.setAttribute("aria-current", "page");
    }
  });

  window.openLiveChat = function (event) {
    if (event && typeof event.preventDefault === "function") {
      event.preventDefault();
    }

    if (
      window.Tawk_API &&
      typeof window.Tawk_API.maximize === "function"
    ) {
      window.Tawk_API.maximize();
      return false;
    }

    window.location.href = "/contact/?source=live-chat";
    return false;
  };
})();
