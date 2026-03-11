$(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    var email = $("#loginEmail").val().trim();
    var password = $("#loginPassword").val().trim();

    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
    var user = users.find(function (u) {
      return u.email === email && u.password === password;
    });

    if (!user) {
      showToast("Invalid email or password", "error");
      return;
    }

    setCurrentUser(user);
    showToast("Welcome back, " + user.name + "!", "success");

    var btn = $(this).find('button[type="submit"]');
    btn.prop("disabled", true).text("Logging in...");

    setTimeout(function () {
      window.location.href = "account.html";
    }, 1000);
  });

  $("#signupPassword").on("input", function () {
    var password = $(this).val();
    var strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    var width = (strength / 5) * 100;
    var colorMap = {
      0: "#E5E7EB",
      1: "#EF4444",
      2: "#F59E0B",
      3: "#F59E0B",
      4: "#10B981",
      5: "#10B981",
    };
    var labelMap = {
      0: "",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong",
      5: "Very Strong",
    };

    $("#strengthBar").css({
      width: width + "%",
      background: colorMap[strength],
    });
    $("#strengthText").text(labelMap[strength]);
  });

  $("#signupForm").on("submit", function (e) {
    e.preventDefault();
    var name = $("#signupName").val().trim();
    var email = $("#signupEmail").val().trim();
    var phone = $("#signupPhone").val().trim();
    var password = $("#signupPassword").val();
    var confirmPassword = $("#signupConfirmPassword").val();

    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
    var exists = users.find(function (u) {
      return u.email === email;
    });
    if (exists) {
      showToast("Email already registered", "error");
      return;
    }

    var newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      joinDate: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("novio_users", JSON.stringify(users));
    setCurrentUser(newUser);
    showToast("Account created successfully!", "success");

    var btn = $(this).find('button[type="submit"]');
    btn.prop("disabled", true).text("Creating account...");

    setTimeout(function () {
      window.location.href = "account.html";
    }, 1000);
  });

  $("#forgotForm").on("submit", function (e) {
    e.preventDefault();
    var email = $("#forgotEmail").val().trim();

    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    var btn = $(this).find('button[type="submit"]');
    btn.prop("disabled", true).text("Sending...");

    setTimeout(function () {
      showToast("Password reset link sent to your email!", "success");
      btn.prop("disabled", false).text("Send Reset Link");
    }, 1500);
  });
});
