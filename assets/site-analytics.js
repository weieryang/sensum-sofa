(function () {
  "use strict";

  // Production GA4 Measurement ID for weieryang.com.
  var GA4_MEASUREMENT_ID = "G-RH7F2SQEQ1";

  if (!/^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID)) return;
  if (!/^https?:$/.test(window.location.protocol)) return;
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname)) return;
  if (window.__weieryangGa4Loaded) return;
  window.__weieryangGa4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function isCushionPath(pathname) {
    return /^\/(?:ru\/)?window-seat-cushions\//.test(pathname) ||
      /^\/(?:ru\/)?products\/(?:teddy-fleece-window-seat-cushion|corduroy-window-seat-cushion|cotton-linen-window-seat-cushion|textured-woven-bay-window-cushion)\//.test(pathname);
  }

  function safeReference(value) {
    return /^(WY-WC0[1-4]|recommend)$/.test(value || "") ? value : "unspecified";
  }

  function contentGroup(pathname) {
    if (isCushionPath(pathname)) {
      var prefix = /^\/ru\//.test(pathname) ? "RU " : "EN ";
      if (/\/(measurement-guide|fabric-design-guide)\/$/.test(pathname)) return prefix + "Cushion Guides";
      if (/\/products\//.test(pathname)) return prefix + "Cushion Products";
      return prefix + "Cushion Collection";
    }
    if (/^\/ru\/guides\//.test(pathname)) return "RU Guides";
    if (/^\/ru\/products\//.test(pathname)) return "RU Products";
    if (/^\/ru\//.test(pathname)) return "RU Landing Pages";
    if (/^\/blog\//.test(pathname)) return "EN Blog";
    if (/^\/products\//.test(pathname)) return "EN Products";
    return "EN Landing Pages";
  }

  function safeLinkText(link) {
    return (link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
  }

  function track(eventName, parameters) {
    window.gtag("event", eventName, Object.assign({
      page_language: document.documentElement.lang || "en",
      content_group: contentGroup(window.location.pathname),
      source_page: window.location.pathname,
      transport_type: "beacon"
    }, parameters || {}));
  }

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted"
  });
  window.gtag("js", new Date());
  window.gtag("config", GA4_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    content_group: contentGroup(window.location.pathname)
  });

  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    var googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA4_MEASUREMENT_ID);
    document.head.appendChild(googleTag);
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (!link) return;

    var rawHref = link.getAttribute("href") || "";
    var linkText = safeLinkText(link);

    if (/^https:\/\/(?:www\.)?wa\.me\//i.test(link.href)) {
      track("contact_click", { contact_method: "whatsapp", link_text: linkText });
      return;
    }
    if (/^mailto:/i.test(rawHref)) {
      track("contact_click", { contact_method: "email", link_text: linkText });
      return;
    }
    if (/^tel:/i.test(rawHref)) {
      track("contact_click", { contact_method: "phone", link_text: linkText });
      return;
    }

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }
    if (destination.origin === "https://weieryang-cushions.yhsj98251.chatgpt.site") {
      track("customization_open", { destination_path: destination.pathname });
      return;
    }
    if (destination.origin !== window.location.origin) return;

    if (/\.(pdf|docx?|xlsx?|csv|zip)$/i.test(destination.pathname)) {
      track("resource_download_click", { resource_path: destination.pathname });
      return;
    }
    if (destination.hash === "#quote" && isCushionPath(destination.pathname)) {
      track("begin_lead", { link_text: linkText, destination_path: destination.pathname });
    }
    if (isCushionPath(destination.pathname) && !isCushionPath(window.location.pathname)) {
      track("cushion_entry_click", { destination_path: destination.pathname });
    }

    if (/^\/(?:ru\/)?contact\//.test(destination.pathname)) {
      track("begin_lead", {
        link_text: linkText,
        destination_path: destination.pathname
      });
      return;
    }
    if (/^\/(?:ru\/)?window-seat-cushions\/(measurement-guide|fabric-design-guide)\/$/.test(destination.pathname)) {
      track("select_content", { content_type: "cushion_guide", item_id: destination.pathname });
      return;
    }
    if (/^\/(?:ru\/)?window-seat-cushions\/$/.test(destination.pathname)) {
      track("select_content", { content_type: "cushion_collection", item_id: destination.pathname });
      return;
    }
    if (/^\/(?:ru\/)?products\//.test(destination.pathname)) {
      track("select_content", {
        content_type: "product",
        item_id: destination.pathname
      });
      return;
    }
    if (/^\/ru\/guides\//.test(destination.pathname)) {
      track("select_content", {
        content_type: "guide",
        item_id: destination.pathname
      });
    }
  });

  var rfqForm = document.querySelector("[data-rfq-form]");
  if (rfqForm) {
    var formStarted = false;
    rfqForm.addEventListener("focusin", function () {
      if (formStarted) return;
      formStarted = true;
      track("lead_form_start", { form_id: "ru_rfq" });
    });
    rfqForm.addEventListener("submit", function () {
      track("inquiry_handoff", {
        contact_method: "whatsapp",
        form_id: "ru_rfq"
      });
    });

    var emailButton = rfqForm.querySelector("[data-rfq-email]");
    if (emailButton) {
      emailButton.addEventListener("click", function () {
        track("inquiry_handoff", {
          contact_method: "email",
          form_id: "ru_rfq"
        });
      });
    }
  }

  var cushionForm = document.querySelector("[data-cushion-inquiry]");
  if (cushionForm) {
    var cushionStarted = false;
    cushionForm.addEventListener("focusin", function () {
      if (cushionStarted) return;
      cushionStarted = true;
      track("lead_form_start", { form_id: "cushion_inquiry" });
    });
    cushionForm.addEventListener("wy:inquiry-prepared", function (event) {
      track("cushion_inquiry_ready", {
        form_id: "cushion_inquiry",
        product_reference: safeReference(event.detail && event.detail.product_reference)
      });
    });
    cushionForm.addEventListener("wy:inquiry-handoff", function (event) {
      var method = event.detail && event.detail.contact_method;
      if (method !== "email" && method !== "whatsapp") return;
      track("contact_click", { contact_method: method, form_id: "cushion_inquiry" });
      track("inquiry_handoff", {
        contact_method: method,
        form_id: "cushion_inquiry",
        product_reference: safeReference(event.detail.product_reference)
      });
    });
  }
})();
