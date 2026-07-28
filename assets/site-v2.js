(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".site-menu-toggle");
  var chatState = "idle";

  function closeMenu() {
    if (!header || !toggle) return;
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    header.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
    },
    { passive: true }
  );

  var path = window.location.pathname.replace(/index\.html$/, "");
  document.querySelectorAll(".site-primary-nav a").forEach(function (link) {
    var href = new URL(link.href, window.location.origin).pathname;
    if (href !== "/" && path.indexOf(href) === 0) {
      link.setAttribute("aria-current", "page");
    }
  });

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
