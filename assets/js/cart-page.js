$(function () {
  if ($("#cartPage").length) {
    renderCart();
  }

  if ($("#paymentPage").length) {
    var cart = getCart();
    var subtotal = 0;
    var orderHtml = "";

    cart.forEach(function (item) {
      subtotal += item.price;
      orderHtml +=
        '<div class="d-flex justify-content-between align-items-center py-2 border-bottom">' +
        '<div class="d-flex align-items-center gap-2">' +
        '<img src="' +
        item.image +
        '" alt="' +
        item.title +
        '" style="width:50px;height:35px;border-radius:4px;object-fit:cover;">' +
        '<span class="small">' +
        item.title +
        "</span>" +
        "</div>" +
        '<span class="fw-semibold">$' +
        item.price.toFixed(2) +
        "</span>" +
        "</div>";
    });

    $("#paymentOrderItems").html(orderHtml);
    $("#paymentSubtotal").text("$" + subtotal.toFixed(2));
    $("#paymentTotal").text("$" + subtotal.toFixed(2));

    var user = getCurrentUser();
    if (user) {
      $("#payName").val(user.name || "");
      $("#payEmail").val(user.email || "");
      $("#payPhone").val(user.phone || "");
    }

    $(".method-option").on("click", function () {
      $(".method-option").removeClass("active");
      $(this).addClass("active");
    });

    $("#paymentForm").on("submit", function (e) {
      e.preventDefault();
      var name = $("#payName").val().trim();
      var email = $("#payEmail").val().trim();
      if (!name || !email) {
        showToast("Please fill in all required fields", "error");
        return;
      }

      var user = getCurrentUser();
      try {
        var enrollments = JSON.parse(
          localStorage.getItem("novio_enrollments") || "[]",
        );
        cart.forEach(function (item) {
          if (
            !enrollments.find(function (e) {
              return e.id === item.id;
            })
          ) {
            enrollments.push({
              id: item.id,
              title: item.title,
              image: item.image,
              enrolledDate: new Date().toISOString(),
              progress: 0,
            });
          }
        });
        localStorage.setItem("novio_enrollments", JSON.stringify(enrollments));
      } catch (e) {}

      try {
        localStorage.removeItem("novio_cart");
      } catch (e) {}
      updateCartBadge();
      showToast("Payment successful! You are now enrolled.", "success");

      setTimeout(function () {
        window.location.href = user ? "account.html" : "my-courses.html";
      }, 1500);
    });
  }
});

function renderCart() {
  var cart = getCart();

  if (cart.length === 0) {
    $("#cartItems").html(
      '<div class="cart-empty">' +
        '<div class="cart-empty-icon"><i class="bi bi-cart3"></i></div>' +
        "<h4>Your Cart is Empty</h4>" +
        "<p>Looks like you haven't added any courses yet. Explore our catalog and find something to learn!</p>" +
        '<a href="courses.html" class="btn btn-primary btn-lg">Browse Courses <i class="bi bi-arrow-right ms-2"></i></a>' +
        "</div>",
    );
    $("#cartSummary").addClass("d-none");
    $("#cartItems")
      .closest(".col-lg-8")
      .removeClass("col-lg-8")
      .addClass("col-12");
    return;
  }

  $("#cartItems").closest(".col-12").removeClass("col-12").addClass("col-lg-8");
  var html = "";
  var subtotal = 0;

  cart.forEach(function (item) {
    subtotal += item.price;
    html +=
      '<div class="cart-item">' +
      '<img src="' +
      item.image +
      '" alt="' +
      item.title +
      '">' +
      '<div class="cart-item-info">' +
      "<h6>" +
      item.title +
      "</h6>" +
      "<p>By " +
      item.instructor +
      "</p>" +
      "</div>" +
      '<span class="cart-item-price">$' +
      item.price.toFixed(2) +
      "</span>" +
      '<button class="btn-remove" onclick="removeCartItem(' +
      item.id +
      ')" title="Remove"><i class="bi bi-x-lg"></i></button>' +
      "</div>";
  });

  $("#cartItems").html(html);
  $("#cartSummary").removeClass("d-none");
  $("#cartSubtotal").text("$" + subtotal.toFixed(2));
  $("#cartTotal").text("$" + subtotal.toFixed(2));
  $("#cartCount").text(cart.length + " course" + (cart.length > 1 ? "s" : ""));
}

function removeCartItem(courseId) {
  removeFromCart(courseId);
  renderCart();
}
