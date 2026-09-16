(function () {
  "use strict";

  var menu = document.querySelector("#ru-navigation");
  var toggle = document.querySelector(".menu-toggle");

  if (menu && toggle) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  var year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  var form = document.querySelector("[data-rfq-form]");
  if (!form) return;

  var requestedModel = new URLSearchParams(window.location.search).get("model");
  var modelField = form.querySelector("[name='model']");
  if (requestedModel && modelField) modelField.value = requestedModel;

  function inquiryText() {
    var data = new FormData(form);
    var rows = [
      "Здравствуйте! Запрос коммерческого предложения с weieryang.com/ru/",
      "Имя / компания: " + (data.get("company") || "не указано"),
      "Страна / город: " + (data.get("destination") || "не указано"),
      "Модель: " + (data.get("model") || "нужна рекомендация"),
      "Количество: " + (data.get("quantity") || "не указано"),
      "Канал продаж: " + (data.get("channel") || "не указано"),
      "Требования: " + (data.get("requirements") || "не указано")
    ];
    return rows.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    window.open(
      "https://wa.me/8613317178019?text=" + encodeURIComponent(inquiryText()),
      "_blank",
      "noopener,noreferrer"
    );
  });

  var emailButton = form.querySelector("[data-rfq-email]");
  if (emailButton) {
    emailButton.addEventListener("click", function () {
      var model = new FormData(form).get("model") || "sofa program";
      window.location.href =
        "mailto:tangkelian@weieryang.com?subject=" +
        encodeURIComponent("Запрос из России: " + model) +
        "&body=" +
        encodeURIComponent(inquiryText());
    });
  }
})();
