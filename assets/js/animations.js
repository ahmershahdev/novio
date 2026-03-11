$(function () {
  $(".btn-toggle-password").on("click", function () {
    var input = $(this).siblings("input");
    var icon = $(this).find("i");
    if (input.attr("type") === "password") {
      input.attr("type", "text");
      icon.removeClass("bi-eye").addClass("bi-eye-slash");
    } else {
      input.attr("type", "password");
      icon.removeClass("bi-eye-slash").addClass("bi-eye");
    }
  });

  $("#contactMessage").on("input", function () {
    var len = $(this).val().length;
    $("#charCount").text(len);
    if (len > 1000) {
      $(this).val($(this).val().substring(0, 1000));
      $("#charCount").text(1000);
    }
  });

  $("#contactForm").on("submit", function (e) {
    e.preventDefault();
    var name = $("#contactName").val().trim();
    var email = $("#contactEmail").val().trim();
    var message = $("#contactMessage").val().trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    var btn = $(this).find('button[type="submit"]');
    btn
      .prop("disabled", true)
      .html('<i class="bi bi-hourglass-split me-2"></i>Sending...');

    setTimeout(function () {
      showToast(
        "Message sent successfully! We'll get back to you soon.",
        "success",
      );
      btn
        .prop("disabled", false)
        .html('<i class="bi bi-send me-2"></i>Send Message');
      $("#contactForm")[0].reset();
      $("#charCount").text("0");
    }, 1500);
  });

  if ($("#trustedTyping").length) {
    var trustedText = "Trusted by teams at leading companies";
    var typingIndex = 0;
    var $typing = $("#trustedTyping");

    function typeText() {
      if (typingIndex <= trustedText.length) {
        $typing.text(trustedText.substring(0, typingIndex));
        typingIndex++;
        setTimeout(typeText, 90);
      }
    }

    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          typeText();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe($typing[0]);
  }

  if ($("#careerTyping").length) {
    var careerLines = [
      "Advance Your Career.",
      "Build Real-World Projects.",
      "Land Your Dream Job.",
      "Master In-Demand Skills.",
      "Learn From Industry Experts.",
      "Get Certified Today.",
      "Join 50K+ Learners.",
      "Unlock New Opportunities.",
      "Code Your Future.",
      "Level Up Your Skills.",
    ];
    var $career = $("#careerTyping");
    var careerIdx = 0;

    function typeCareerLine() {
      var line = careerLines[careerIdx];
      var charIdx = 0;
      $career.text("");

      function typeChar() {
        if (charIdx <= line.length) {
          $career.text(line.substring(0, charIdx));
          charIdx++;
          setTimeout(typeChar, 100);
        } else {
          setTimeout(eraseChar, 2500);
        }
      }

      function eraseChar() {
        var current = $career.text();
        if (current.length > 0) {
          $career.text(current.substring(0, current.length - 1));
          setTimeout(eraseChar, 50);
        } else {
          careerIdx = (careerIdx + 1) % careerLines.length;
          setTimeout(typeCareerLine, 600);
        }
      }

      typeChar();
    }

    typeCareerLine();
  }

  $(".newsletter-form").on("submit", function (e) {
    e.preventDefault();
    var email = $(this).find("input").val().trim();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }
    showToast("Subscribed successfully!", "success");
    $(this).find("input").val("");
  });
});
