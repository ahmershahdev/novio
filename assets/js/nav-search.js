$(function () {
  $(".navbar-inner .nav-link").on("click", function () {
    var collapse = bootstrap.Collapse.getInstance(
      document.getElementById("mobileNav"),
    );
    if (collapse) collapse.hide();
  });

  if ($(".navbar-search").length) {
    var $navSearchInput = $(".navbar-search .search-input");
    var $navSuggestions = $(".navbar-search .nav-search-suggestions");
    var navSearchTimeout;

    $navSearchInput.on("input", function () {
      clearTimeout(navSearchTimeout);
      var query = $(this).val().toLowerCase().trim();

      if (query.length >= 2) {
        var matches = coursesData.filter(function (c) {
          return (
            c.title.toLowerCase().indexOf(query) > -1 ||
            c.category.toLowerCase().indexOf(query) > -1 ||
            c.instructor.toLowerCase().indexOf(query) > -1
          );
        });

        if (matches.length > 0) {
          var html = "";
          matches.slice(0, 6).forEach(function (c) {
            html +=
              '<a href="course-detail.html?id=' +
              c.id +
              '" class="nav-search-suggestion-item">' +
              '<img src="' +
              c.image +
              '" alt="' +
              c.title.replace(/"/g, "&quot;") +
              '">' +
              '<div class="suggestion-info">' +
              '<div class="suggestion-title">' +
              c.title +
              "</div>" +
              '<div class="suggestion-cat">' +
              c.category +
              " &middot; " +
              c.instructor +
              "</div>" +
              "</div>" +
              '<span class="suggestion-price">$' +
              c.price.toFixed(2) +
              "</span>" +
              "</a>";
          });
          if (matches.length > 6) {
            html +=
              '<a href="courses.html" class="nav-search-suggestion-item" style="justify-content:center;color:var(--primary);font-weight:600;">' +
              "View all " +
              matches.length +
              ' results <i class="bi bi-arrow-right ms-1"></i></a>';
          }
          $navSuggestions.html(html).addClass("active");
        } else {
          $navSuggestions
            .html(
              '<div class="nav-search-suggestion-item" style="justify-content:center;color:var(--text-muted);">' +
                '<i class="bi bi-info-circle me-2"></i>No courses found</div>',
            )
            .addClass("active");
        }
      } else {
        $navSuggestions.removeClass("active").empty();
      }
    });

    $navSearchInput.on("focus", function () {
      if ($(this).val().trim().length >= 2) {
        $navSuggestions.addClass("active");
      }
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".navbar-search").length) {
        $navSuggestions.removeClass("active").empty();
      }
    });

    $navSearchInput.on("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var query = $(this).val().trim();
        if (query) {
          window.location.href = "courses.html";
        }
      }
    });
  }
});
