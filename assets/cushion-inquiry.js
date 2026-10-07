(function () {
  "use strict";
  var ru = document.documentElement.lang === "ru";
  var form = document.querySelector("[data-cushion-inquiry]");
  if (!form) return;
  var result = form.querySelector("[data-inquiry-result]");
  var message = form.querySelector("[data-inquiry-message]");
  var email = form.querySelector("[data-inquiry-email]");
  var whatsapp = form.querySelector("[data-inquiry-whatsapp]");
  var status = form.querySelector("[data-inquiry-status]");
  var fields = form.elements;
  var references = ["WY-WC01", "WY-WC02", "WY-WC03", "WY-WC04"];
  var source = "https://weieryang.com" + window.location.pathname;
  var preparedEmail = "";
  var preparedWhatsapp = "";
  var preparedReference = "recommend";

  function text(en, russian) { return ru ? russian : en; }
  function notify(name, reference, method) {
    form.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      detail: { product_reference: reference, contact_method: method }
    }));
  }

  form.addEventListener("input", function () {
    fields.dimensions.setCustomValidity("");
    fields.destination.setCustomValidity("");
    result.hidden = true;
    status.textContent = "";
  });
  form.addEventListener("change", function () { result.hidden = true; });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    [fields.dimensions, fields.destination].forEach(function (field) {
      field.setCustomValidity(field.value.trim() ? "" : text("Please fill in this field.", "Заполните это поле."));
    });
    if (!form.reportValidity()) return;
    var quantity = Number(fields.quantity.value);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) return;
    var reference = references.indexOf(fields.design.value) >= 0 ? fields.design.value : "recommend";
    var design = reference === "recommend" ? text("Please recommend a design", "Помогите выбрать дизайн") : fields.design.selectedOptions[0].textContent.trim();
    var rows = [
      text("Hello Weieryang, please prepare a window seat cushion quotation.", "Здравствуйте! Прошу рассчитать подушку для подоконника."),
      text("Design: ", "Дизайн: ") + design,
      text("Dimensions / unit: ", "Размеры / единицы: ") + fields.dimensions.value.trim(),
      text("Quantity: ", "Количество: ") + quantity,
      text("Delivery country / postal code: ", "Страна / почтовый индекс: ") + fields.destination.value.trim(),
      text("Preferences: ", "Пожелания: ") + (fields.preferences.value.trim() || text("None specified", "Не указаны")),
      text("Please confirm finished dimensions, fabric, foam, cover construction, item price, shipping and production time before ordering.", "Прошу подтвердить итоговые размеры, ткань, наполнитель, чехол, цену, доставку и срок изготовления до заказа."),
      text("Source page: ", "Страница: ") + source
    ];
    var inquiry = rows.join("\n");
    message.textContent = inquiry;
    // Keep customer requirements out of href attributes so automatic outbound-link
    // measurement cannot collect the message as a link_url parameter.
    preparedEmail = "mailto:tangkelian@weieryang.com?subject=" + encodeURIComponent(text("Cushion quotation — ", "Расчет подушки — ") + reference) + "&body=" + encodeURIComponent(inquiry);
    preparedWhatsapp = "https://wa.me/8613317178019?text=" + encodeURIComponent(inquiry);
    preparedReference = reference;
    status.textContent = "";
    result.hidden = false;
    form.querySelector("[data-inquiry-heading]").focus();
    notify("wy:inquiry-prepared", reference);
  });

  email.addEventListener("click", function () {
    if (result.hidden || !preparedEmail) return;
    notify("wy:inquiry-handoff", preparedReference, "email");
    window.location.href = preparedEmail;
  });
  whatsapp.addEventListener("click", function () {
    if (result.hidden || !preparedWhatsapp) return;
    notify("wy:inquiry-handoff", preparedReference, "whatsapp");
    window.open(preparedWhatsapp, "_blank", "noopener,noreferrer");
  });

  form.querySelector("[data-inquiry-copy]").addEventListener("click", async function () {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(message.textContent);
      status.textContent = text("Copied. Paste the message into your email or chat and send it there.", "Скопировано. Вставьте текст в письмо или чат и отправьте его там.");
    } catch (error) {
      status.textContent = text("Select the message above to copy it, or use the email / WhatsApp links.", "Выделите текст выше для копирования или используйте ссылки email / WhatsApp.");
    }
  });

  form.hidden = false;
  var fallback = document.querySelector("[data-inquiry-fallback]");
  if (fallback) fallback.hidden = true;
})();
