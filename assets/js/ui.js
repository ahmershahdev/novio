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
