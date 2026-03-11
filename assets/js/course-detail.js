$(function () {
  if ($("#courseDetailPage").length) {
    var urlParams = new URLSearchParams(window.location.search);
    var courseId = parseInt(urlParams.get("id")) || 1;
    var course = coursesData.find(function (c) {
      return c.id === courseId;
    });

    if (course) {
      $("#cdTitle").text(course.title);
      $("#cdDescription").text(course.description);
      $("#cdImage").attr("src", course.image).attr("alt", course.title);
      $("#cdInstructor").text(course.instructor);
      $("#cdInstructorImg").attr("src", course.instructorImg);
      $("#cdRating").text(course.rating);
      $("#cdReviews").text("(" + course.reviews.toLocaleString() + " reviews)");
      $("#cdStudents").text(course.students.toLocaleString() + " students");
      $("#cdPrice").text("$" + course.price.toFixed(2));
      $("#cdOriginalPrice").text("$" + course.originalPrice.toFixed(2));
      $("#cdDuration").text(course.duration);
      $("#cdLessons").text(course.lessons + " lessons");
      $("#cdLevel").text(course.level);
      $("#cdCategory").text(course.category);

      var discount = Math.round(
        (1 - course.price / course.originalPrice) * 100,
      );
      $("#cdDiscount").text(discount + "% off");

      var starsHtml = "";
      for (var i = 0; i < Math.floor(course.rating); i++)
        starsHtml += '<i class="bi bi-star-fill"></i>';
      if (course.rating % 1 >= 0.5)
        starsHtml += '<i class="bi bi-star-half"></i>';
      $("#cdStars").html(starsHtml);

      document.title = course.title + " | NOVIO";
      $('meta[name="description"]').attr("content", course.description);

      $("#cdAddToCart").on("click", function () {
        addToCart(course.id);
      });

      var related = coursesData
        .filter(function (c) {
          return c.category === course.category && c.id !== course.id;
        })
        .slice(0, 3);

      if (related.length === 0) {
        related = coursesData
          .filter(function (c) {
            return c.id !== course.id;
          })
          .slice(0, 3);
      }

      var relHtml = "";
      related.forEach(function (c) {
        relHtml += renderCourseCard(c);
      });
      $("#relatedCourses").html(relHtml);
    }
  }
});
