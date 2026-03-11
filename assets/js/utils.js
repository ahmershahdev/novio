function getCurrentUser() {
  var userData = localStorage.getItem("novio_user");
  return userData ? JSON.parse(userData) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("novio_user", JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem("novio_user");
  showToast("Logged out successfully", "success");
  setTimeout(function () {
    window.location.href = "index.html";
  }, 500);
}

function updateNavAuth() {
  var user = getCurrentUser();
  if (user) {
    $("#loginBtn, #signupBtn").addClass("d-none");
    $("#accountDropdown").removeClass("d-none");
  } else {
    $("#loginBtn, #signupBtn").removeClass("d-none");
    $("#accountDropdown").addClass("d-none");
  }
}

function showToast(message, type) {
  type = type || "success";
  var iconMap = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-circle-fill",
  };
  var toast = $(
    '<div class="custom-toast ' +
      type +
      '">' +
      '<i class="bi ' +
      iconMap[type] +
      '"></i>' +
      "<p></p>" +
      "</div>",
  );
  toast.find("p").text(message);

  var container = $(".toast-container");
  if (!container.length) {
    container = $('<div class="toast-container"></div>');
    $("body").append(container);
  }

  container.append(toast);

  setTimeout(function () {
    toast.css({ opacity: 0, transform: "translateX(100%)" });
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}

function getCart() {
  var cart = localStorage.getItem("novio_cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("novio_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(courseId) {
  var cart = getCart();
  var course = coursesData.find(function (c) {
    return c.id === courseId;
  });
  if (!course) return;

  var exists = cart.find(function (item) {
    return item.id === courseId;
  });
  if (exists) {
    showToast("Course already in cart", "warning");
    return;
  }

  cart.push({
    id: course.id,
    title: course.title,
    image: course.image,
    price: course.price,
    instructor: course.instructor,
  });

  saveCart(cart);
  showToast("Added to cart!", "success");
}

function removeFromCart(courseId) {
  var cart = getCart();
  cart = cart.filter(function (item) {
    return item.id !== courseId;
  });
  saveCart(cart);
  showToast("Removed from cart", "success");
}

function updateCartBadge() {
  var cart = getCart();
  var count = cart.length;
  $(".cart-badge").text(count).attr("data-count", count);
}

$(function () {
  updateNavAuth();
  updateCartBadge();
});
