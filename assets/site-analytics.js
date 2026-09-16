(function () {
  "use strict";

  // Production GA4 Measurement ID for weieryang.com.
  var GA4_MEASUREMENT_ID = "G-NWC2CQBEPE";

  if (!/^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID)) return;
  if (!/^https?:$/.test(window.location.protocol)) return;
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname)) return;
  if (window.__weieryangGa4Loaded) return;
  window.__weieryangGa4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function contentGroup(pathname) {
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
    if (destination.origin !== window.location.origin) return;

    if (/^\/(?:ru\/)?contact\//.test(destination.pathname)) {
      track("begin_lead", {
        link_text: linkText,
        destination_path: destination.pathname
      });
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
      track("generate_lead", {
        contact_method: "whatsapp",
        form_id: "ru_rfq"
      });
    });

    var emailButton = rfqForm.querySelector("[data-rfq-email]");
    if (emailButton) {
      emailButton.addEventListener("click", function () {
        track("generate_lead", {
          contact_method: "email",
          form_id: "ru_rfq"
        });
      });
    }
  }
})();
