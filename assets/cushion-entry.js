(function () {
  'use strict';
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-cushion-entry]');
    if (!link) return;
    var entry = link.getAttribute('data-cushion-entry');
    var destination = new URL(link.href);
    var parameters = { entry_id: entry, page_language: document.documentElement.lang || 'en', destination_host: destination.hostname, destination_path: destination.pathname, transport_type: 'beacon' };
    window.dispatchEvent(new CustomEvent('weieryang-cushion-entry', { detail: parameters }));
    // Reuse the established tag without changing any existing event behavior.
    if (typeof window.gtag === 'function' && !/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(location.hostname)) window.gtag('event', 'cushion_store_entry', parameters);
  });
})();
