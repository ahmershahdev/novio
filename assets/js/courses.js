function renderCourseCard(course) {
  var badgeHtml = course.badge
    ? '<span class="badge-overlay ' +
      (course.badge === "Bestseller" ? "bestseller" : "") +
      '">' +
      course.badge +
      "</span>"
    : "";

  var starsHtml = "";
  var fullStars = Math.floor(course.rating);
  for (var i = 0; i < fullStars; i++)
    starsHtml += '<i class="bi bi-star-fill"></i>';
  if (course.rating % 1 >= 0.5) starsHtml += '<i class="bi bi-star-half"></i>';

  return (
    '<div class="col-lg-4 col-md-6 mb-4">' +
    '<div class="course-card">' +
    '<div class="card-img-wrapper">' +
    '<img src="' +
    course.image +
    '" alt="' +
    course.title +
    '" loading="lazy">' +
    badgeHtml +
    "</div>" +
    '<div class="card-body">' +
    '<span class="card-category">' +
    course.category +
    "</span>" +
    '<h5 class="card-title"><a href="course-detail.html?id=' +
    course.id +
    '">' +
    course.title +
    "</a></h5>" +
    '<div class="card-instructor">' +
    '<img src="' +
    course.instructorImg +
    '" alt="' +
    course.instructor +
    '">' +
    "<span>" +
    course.instructor +
    "</span>" +
    "</div>" +
    '<div class="card-meta">' +
    '<span><i class="bi bi-clock"></i>' +
    course.duration +
    "</span>" +
    '<span><i class="bi bi-book"></i>' +
    course.lessons +
    " lessons</span>" +
    '<span><i class="bi bi-bar-chart"></i>' +
    course.level +
    "</span>" +
    "</div>" +
    '<div class="card-rating">' +
    '<span class="stars">' +
    starsHtml +
    "</span>" +
    "<span>" +
    course.rating +
    "</span>" +
    '<span class="count">(' +
    course.reviews.toLocaleString() +
    ")</span>" +
    "</div>" +
    '<div class="card-footer-custom">' +
    '<div class="price">$' +
    course.price.toFixed(2) +
    '<span class="original">$' +
    course.originalPrice.toFixed(2) +
    "</span></div>" +
    '<button class="btn-enroll" onclick="addToCart(' +
    course.id +
    ')">Add to Cart</button>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>"
  );
}

var categoryIcons = {
  "Web Development": "bi-code-slash",
  "Data Science": "bi-graph-up",
  Programming: "bi-terminal",
  Design: "bi-palette",
  "Artificial Intelligence": "bi-robot",
  Cybersecurity: "bi-shield-lock",
  "Cloud Computing": "bi-cloud",
  DevOps: "bi-gear",
  "Mobile Dev": "bi-phone",
};

function renderAllCourses(courses, grouped) {
  if (courses.length === 0) {
    $("#allCourses").html(
      '<div class="col-12 text-center py-5">' +
        '<i class="bi bi-search" style="font-size: 3rem; color: var(--text-muted);"></i>' +
        '<h5 class="mt-3">No courses found</h5>' +
        '<p class="text-muted">Try adjusting your search or filters</p>' +
        "</div>",
    );
    $(".result-count").text("0 courses found");
    return;
  }

  var html = "";
  if (grouped) {
    var categories = {};
    courses.forEach(function (course) {
      if (!categories[course.category]) {
        categories[course.category] = [];
      }
      categories[course.category].push(course);
    });
    var catOrder = [
      "Web Development",
      "Data Science",
      "Programming",
      "Design",
      "Artificial Intelligence",
      "Cybersecurity",
      "Cloud Computing",
      "DevOps",
      "Mobile Dev",
    ];
    catOrder.forEach(function (cat) {
      if (categories[cat] && categories[cat].length > 0) {
        var icon = categoryIcons[cat] || "bi-folder";
        html += '<div class="col-12 course-category-header">';
        html += '<div class="d-flex align-items-center gap-3 mb-3 mt-4">';
        html +=
          '<div class="category-icon-badge"><i class="bi ' +
          icon +
          '"></i></div>';
        html += '<div><h4 class="mb-0 fw-bold">' + cat + "</h4>";
        html +=
          '<small class="text-muted">' +
          categories[cat].length +
          " courses available</small></div>";
        html += "</div></div>";
        categories[cat].forEach(function (course) {
          html += renderCourseCard(course);
        });
      }
    });
  } else {
    courses.forEach(function (course) {
      html += renderCourseCard(course);
    });
  }
  $("#allCourses").html(html);
  $(".result-count").text(courses.length + " courses found");
}

function filterCourses() {
  var query = ($("#courseSearch").val() || "").toLowerCase().trim();
  var selectedCategories = [];
  $(".filter-category:checked").each(function () {
    selectedCategories.push($(this).val());
  });
  var selectedLevels = [];
  $(".filter-level:checked").each(function () {
    selectedLevels.push($(this).val());
  });
  var selectedPrices = [];
  $(".filter-price:checked").each(function () {
    selectedPrices.push($(this).val());
  });
  var selectedDurations = [];
  $(".filter-duration:checked").each(function () {
    selectedDurations.push($(this).val());
  });

  var filtered = coursesData.filter(function (course) {
    var matchQuery =
      !query ||
      course.title.toLowerCase().indexOf(query) > -1 ||
      course.category.toLowerCase().indexOf(query) > -1 ||
      course.instructor.toLowerCase().indexOf(query) > -1 ||
      course.description.toLowerCase().indexOf(query) > -1;

    var matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.indexOf(course.category) > -1;

    var matchLevel =
      selectedLevels.length === 0 || selectedLevels.indexOf(course.level) > -1;

    var matchPrice =
      selectedPrices.length === 0 ||
      selectedPrices.some(function (p) {
        return p === "free" ? course.price === 0 : course.price > 0;
      });

    var matchDuration =
      selectedDurations.length === 0 ||
      selectedDurations.some(function (d) {
        var hrs = parseFloat(course.duration) || 0;
        if (d === "short") return hrs < 5;
        if (d === "medium") return hrs >= 5 && hrs <= 15;
        return hrs > 15;
      });

    return (
      matchQuery && matchCategory && matchLevel && matchPrice && matchDuration
    );
  });

  var sortVal = $("#sortSelect").val();
  if (sortVal === "price-low") {
    filtered.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortVal === "price-high") {
    filtered.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortVal === "rating") {
    filtered.sort(function (a, b) {
      return b.rating - a.rating;
    });
  } else if (sortVal === "popular") {
    filtered.sort(function (a, b) {
      return b.students - a.students;
    });
  }

  renderAllCourses(filtered);
}

$(function () {
  if ($("#featuredCourses").length) {
    var featured = coursesData.slice(0, 6);
    var html = "";
    featured.forEach(function (course) {
      html += renderCourseCard(course);
    });
    $("#featuredCourses").html(html);
  }

  if ($("#allCourses").length) {
    renderAllCourses(coursesData, true);
  }

  if ($("#courseSearch").length) {
    var searchTimeout;
    var $searchInput = $("#courseSearch");
    var $searchWrapper = $searchInput.closest(".search-input-wrapper");
    var $suggestionsBox = $('<div class="search-suggestions"></div>');
    $searchWrapper.append($suggestionsBox);

    $searchInput.on("input", function () {
      clearTimeout(searchTimeout);
      var query = $(this).val().toLowerCase().trim();

      if (query.length >= 2) {
        var suggestions = coursesData.filter(function (c) {
          return (
            c.title.toLowerCase().indexOf(query) > -1 ||
            c.category.toLowerCase().indexOf(query) > -1 ||
            c.instructor.toLowerCase().indexOf(query) > -1
          );
        });

        if (suggestions.length > 0) {
          var sugHtml = "";
          suggestions.slice(0, 6).forEach(function (c) {
            sugHtml +=
              '<div class="search-suggestion-item" data-title="' +
              c.title.replace(/"/g, "&quot;") +
              '">' +
              '<i class="bi bi-search"></i>' +
              "<span>" +
              c.title +
              "</span>" +
              '<span class="suggestion-category">' +
              c.category +
              "</span>" +
              "</div>";
          });
          $suggestionsBox.html(sugHtml).addClass("active");
        } else {
          $suggestionsBox
            .html(
              '<div class="search-suggestion-item"><i class="bi bi-info-circle"></i><span>No results found</span></div>',
            )
            .addClass("active");
        }
      } else {
        $suggestionsBox.removeClass("active").empty();
      }

      searchTimeout = setTimeout(function () {
        filterCourses();
      }, 300);
    });

    $suggestionsBox.on("click", ".search-suggestion-item", function () {
      var title = $(this).data("title");
      if (title) {
        $searchInput.val(title);
        $suggestionsBox.removeClass("active").empty();
        filterCourses();
      }
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".search-input-wrapper").length) {
        $suggestionsBox.removeClass("active").empty();
      }
    });

    $searchInput.on("keydown", function (e) {
      var $items = $suggestionsBox.find(".search-suggestion-item[data-title]");
      var $active = $items.filter(".active");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if ($active.length) {
          $active
            .removeClass("active")
            .next(".search-suggestion-item[data-title]")
            .addClass("active");
        } else {
          $items.first().addClass("active");
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if ($active.length) {
          $active
            .removeClass("active")
            .prev(".search-suggestion-item[data-title]")
            .addClass("active");
        }
      } else if (e.key === "Enter" && $active.length) {
        e.preventDefault();
        $active.trigger("click");
      }
    });
  }

  $(".filter-check").on("change", function () {
    filterCourses();
  });

  $("#sortSelect").on("change", function () {
    filterCourses();
  });

  $("#clearFilters").on("click", function () {
    $(".filter-check").prop("checked", false);
    $("#courseSearch").val("");
    $("#sortSelect").val("default");
    $(".category-chip").removeClass("active");
    $(".category-chip[data-category='all']").addClass("active");
    filterCourses();
  });

  $(".category-chip").on("click", function () {
    $(".category-chip").removeClass("active");
    $(this).addClass("active");
    var cat = $(this).data("category");
    $(".filter-category").prop("checked", false);
    if (cat !== "all") {
      $(".filter-category[value='" + cat + "']").prop("checked", true);
    }
    filterCourses();
  });
});
