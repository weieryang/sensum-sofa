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
    closeLanguageSwitchers();
  }

  function updateMobileNavigationPosition() {
    if (!header || !navigation) return;
    navigation.style.setProperty(
      "--mobile-nav-top",
      Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + "px"
    );
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
        return;
      }
      updateMobileNavigationPosition();
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

    window.addEventListener("resize", function () {
      if (navigation.classList.contains("open")) {
        updateMobileNavigationPosition();
      }
    });
  }

  var languageSwitchers = document.querySelectorAll(
    "[data-language-switcher]"
  );
  var languageStatusDefault = "On-device translation · stays on this page";
  var languageNames = {
    ja: "Japanese",
    es: "Spanish",
    fr: "French",
    de: "German",
    pt: "Portuguese",
    ar: "Arabic",
    ko: "Korean",
    "zh-CN": "Chinese"
  };
  var translationNodes = null;
  var translationCache = {};
  var translationRequest = 0;

  function updateLanguageStatus(message, state) {
    document.querySelectorAll("[data-language-status]").forEach(function (item) {
      item.textContent = message;
      item.classList.toggle("is-loading", state === "loading");
      item.classList.toggle("is-error", state === "error");
    });
  }

  function updateLanguageControls(languageCode) {
    document.querySelectorAll("[data-language-code]").forEach(function (link) {
      var isCurrent = link.getAttribute("data-language-code") === languageCode;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    document.querySelectorAll(".language-code").forEach(function (label) {
      label.textContent = languageCode === "zh-CN" ? "ZH" : languageCode.toUpperCase();
    });
  }

  function collectTranslationNodes() {
    if (translationNodes) return translationNodes;

    translationNodes = [];
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          var parent = node.parentElement;
          var text = node.nodeValue.trim();
          if (!parent || !text || !/[A-Za-z]/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (
            parent.closest(
              "script, style, noscript, svg, [data-language-switcher], .brand, .brand-mark"
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          if (
            text === "Weieryang" ||
            /@|\+86|^FN-|^\d+[+%]?$/i.test(text)
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    var node;
    while ((node = walker.nextNode())) {
      var value = node.nodeValue;
      translationNodes.push({
        node: node,
        original: value.trim(),
        leading: (value.match(/^\s*/) || [""])[0],
        trailing: (value.match(/\s*$/) || [""])[0]
      });
    }
    return translationNodes;
  }

  function restoreEnglish() {
    collectTranslationNodes().forEach(function (entry) {
      entry.node.nodeValue = entry.leading + entry.original + entry.trailing;
    });
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.body.classList.remove("is-translating");
    updateLanguageControls("en");
    updateLanguageStatus(languageStatusDefault);
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  }

  async function translatePage(languageCode) {
    var requestId = ++translationRequest;
    var targetLanguage = languageCode === "zh-CN" ? "zh" : languageCode;
    var languageName = languageNames[languageCode] || languageCode;
    var entries = collectTranslationNodes();

    entries.forEach(function (entry) {
      entry.node.nodeValue = entry.leading + entry.original + entry.trailing;
    });

    if (!("Translator" in window)) {
      updateLanguageStatus(
        "Inline translation requires desktop Chrome 138 or newer.",
        "error"
      );
      return;
    }

    document.body.classList.add("is-translating");
    updateLanguageStatus(
      "Preparing " + languageName + " · first use downloads a browser language pack…",
      "loading"
    );

    var translator;
    var translationTimeout;
    try {
      var createTranslator = window.Translator.create({
        sourceLanguage: "en",
        targetLanguage: targetLanguage,
        monitor: function (monitor) {
          monitor.addEventListener("downloadprogress", function (event) {
            updateLanguageStatus(
              "Downloading " + languageName + " language pack · " +
                Math.round(event.loaded * 100) + "%",
              "loading"
            );
          });
        }
      });
      var timedOut = new Promise(function (_, reject) {
        translationTimeout = window.setTimeout(function () {
          reject(new Error("The browser language pack took too long to download. Please try again."));
        }, 120000);
      });
      translator = await Promise.race([createTranslator, timedOut]);

      if (!translationCache[languageCode]) {
        translationCache[languageCode] = {};
        var uniqueText = [];
        entries.forEach(function (entry) {
          if (uniqueText.indexOf(entry.original) === -1) {
            uniqueText.push(entry.original);
          }
        });

        for (var index = 0; index < uniqueText.length; index += 1) {
          if (requestId !== translationRequest) return;
          if (index % 8 === 0) {
            updateLanguageStatus(
              "Translating to " + languageName + " · " +
                Math.round((index / uniqueText.length) * 100) + "%",
              "loading"
            );
          }
          translationCache[languageCode][uniqueText[index]] =
            await translator.translate(uniqueText[index]);
        }
      }

      if (requestId !== translationRequest) return;
      entries.forEach(function (entry) {
        var translated = translationCache[languageCode][entry.original];
        if (translated) {
          entry.node.nodeValue = entry.leading + translated + entry.trailing;
        }
      });

      document.documentElement.lang = languageCode;
      document.documentElement.dir = languageCode === "ar" ? "rtl" : "ltr";
      updateLanguageControls(languageCode);
      updateLanguageStatus(languageName + " · translated on this page");
      window.history.replaceState(
        null,
        "",
        window.location.pathname + "?lang=" + encodeURIComponent(languageCode) +
          window.location.hash
      );
      closeLanguageSwitchers();
    } catch (error) {
      updateLanguageStatus(
        error && error.message
          ? error.message
          : "Inline translation is unavailable in this browser.",
        "error"
      );
    } finally {
      window.clearTimeout(translationTimeout);
      document.body.classList.remove("is-translating");
      if (translator && typeof translator.destroy === "function") {
        translator.destroy();
      }
    }
  }

  function closeLanguageSwitchers(exception) {
    languageSwitchers.forEach(function (switcher) {
      if (switcher === exception) return;
      switcher.classList.remove("is-open");
      var trigger = switcher.querySelector(".language-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  languageSwitchers.forEach(function (switcher) {
    var trigger = switcher.querySelector(".language-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = switcher.classList.toggle("is-open");
      closeLanguageSwitchers(isOpen ? switcher : null);
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    switcher.querySelectorAll("[data-language-code]").forEach(function (link) {
      var languageCode = link.getAttribute("data-language-code");
      if (!languageCode) return;

      if (languageCode === "ru") {
        var russianRoutes = {
          "/": "/ru/",
          "/compressed-sofa/": "/ru/compressed-sofa/",
          "/packing/": "/ru/packing/",
          "/contact/": "/ru/contact/",
          "/products/fn-011b-compressed-sofa/": "/ru/products/fn-011b-compressed-sofa/",
          "/products/fn-104-sofa-bed/": "/ru/products/fn-104-sofa-bed/",
          "/products/fn-802-floor-sofa/": "/ru/products/fn-802-floor-sofa/"
        };
        link.href = russianRoutes[window.location.pathname] || "/ru/";
        link.removeAttribute("target");
        link.removeAttribute("rel");
        return;
      }

      link.href = languageCode === "en" ? "/" : "?lang=" + languageCode;
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.addEventListener("click", function (event) {
        event.preventDefault();
        if (languageCode === "en") {
          translationRequest += 1;
          restoreEnglish();
          closeLanguageSwitchers();
          return;
        }
        translatePage(languageCode);
      });
    });
  });

  if (languageSwitchers.length) {
    document.addEventListener("click", function (event) {
      if (!event.target.closest("[data-language-switcher]")) {
        closeLanguageSwitchers();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLanguageSwitchers();
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

    document.documentElement.classList.add("reveal-ready");
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
    var chatTimeout = window.setTimeout(function () {
      if (chatState !== "loading") return;
      chatState = "failed";
      window.location.href = "/contact/?source=live-chat-timeout";
    }, 8000);
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    var previousOnLoad = window.Tawk_API.onLoad;
    window.Tawk_API.onLoad = function () {
      window.clearTimeout(chatTimeout);
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
      window.clearTimeout(chatTimeout);
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
