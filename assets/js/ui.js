$(function () {
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").addClass("visible");
    } else {
      $(".back-to-top").removeClass("visible");
    }
  });

  $(".back-to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 400);
  });

  $(window).on("scroll", animateOnScroll);
  animateOnScroll();

  var $carousel = $("#testimonialCarousel");
  if ($carousel.length) {
    $carousel.on("slid.bs.carousel", function () {
      var idx = $carousel.find(".carousel-item.active").index();
      $(".carousel-indicators-custom button").removeClass("active");
      $(".carousel-indicators-custom button").eq(idx).addClass("active");
    });
  }
});

function animateOnScroll() {
  $(".animate-on-scroll").each(function () {
    var elemTop = $(this).offset().top;
    var winBottom = $(window).scrollTop() + $(window).height();
    if (elemTop < winBottom - 60) {
      $(this).addClass("animated");
    }
  });
}

function initCustomSelects() {
  $("select.form-select, select.sort-select").each(function () {
    var $select = $(this);
    if ($select.closest(".custom-select-wrapper").length) return;

    var wrapper = $('<div class="custom-select-wrapper"></div>');
    var selectedOpt = $select.find("option:selected");
    var isEmpty = !selectedOpt.val();
    var triggerText = selectedOpt.text();

    var trigger = $(
      '<div class="custom-select-trigger" tabindex="0" role="combobox" aria-expanded="false" aria-haspopup="listbox">' +
        '<span class="selected-text' +
        (isEmpty ? " placeholder" : "") +
        '">' +
        $("<span>").text(triggerText).html() +
        "</span>" +
        '<span class="arrow"></span>' +
        "</div>",
    );

    var options = $('<div class="custom-select-options" role="listbox"></div>');
    $select.find("option").each(function () {
      var $opt = $(this);
      var isSelected = $opt.prop("selected") && $opt.val();
      var optEl = $(
        '<div class="custom-select-option' +
          (isSelected ? " selected" : "") +
          '" data-value="' +
          $("<span>").text($opt.val()).html() +
          '" role="option">' +
          $("<span>").text($opt.text()).html() +
          "</div>",
      );
      options.append(optEl);
    });

    $select.after(wrapper);
    wrapper.append($select).append(trigger).append(options);

    trigger.on("click", function (e) {
      e.stopPropagation();
      $(".custom-select-trigger.open")
        .not(trigger)
        .each(function () {
          $(this).removeClass("open").attr("aria-expanded", "false");
          $(this).siblings(".custom-select-options").removeClass("show");
        });
      trigger.toggleClass("open");
      options.toggleClass("show");
      trigger.attr("aria-expanded", trigger.hasClass("open"));
    });

    trigger.on("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      } else if (e.key === "Escape") {
        trigger.removeClass("open").attr("aria-expanded", "false");
        options.removeClass("show");
      }
    });

    options.on("click", ".custom-select-option", function () {
      var val = $(this).data("value");
      var text = $(this).text();
      $select.val(val).trigger("change");
      options.find(".custom-select-option").removeClass("selected");
      $(this).addClass("selected");
      trigger.find(".selected-text").text(text).removeClass("placeholder");
      if (!val) trigger.find(".selected-text").addClass("placeholder");
      trigger.removeClass("open").attr("aria-expanded", "false");
      options.removeClass("show");
    });
  });

  $(document).on("click", function () {
    $(".custom-select-trigger.open")
      .removeClass("open")
      .attr("aria-expanded", "false");
    $(".custom-select-options.show").removeClass("show");
  });
}

$(function () {
  initCustomSelects();
});
