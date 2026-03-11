$(function () {
  if ($("#accountPage").length) {
    var user = getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    $("#accName").text(user.name);
    $("#accEmail").text(user.email);
    $("#editName").val(user.name);
    $("#editEmail").val(user.email);
    $("#editPhone").val(user.phone || "");
    $("#editBio").val(user.bio || "");
    $("#editAddress").val(user.address || "");
    $("#socialGithub").val(user.socialGithub || "");
    $("#socialLinkedin").val(user.socialLinkedin || "");
    $("#socialFacebook").val(user.socialFacebook || "");
    $("#socialWebsite").val(user.socialWebsite || "");

    if (user.profileImage) {
      $("#avatarImg").attr("src", user.profileImage).show();
      $("#avatarInitials").hide();
    }

    if (user.resumeName) {
      $("#resumeFileName").text(user.resumeName);
    }

    var initials = user.name
      .split(" ")
      .map(function (n) {
        return n[0];
      })
      .join("")
      .toUpperCase()
      .substring(0, 2);
    $("#avatarInitials").text(initials);

    $("#profileAvatar").on("click", function () {
      $("#profileImageInput").click();
    });

    $("#profileImageInput").on("change", function () {
      var file = this.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image must be under 2MB", "error");
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        user.profileImage = e.target.result;
        setCurrentUser(user);
        var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
        var idx = users.findIndex(function (u) {
          return u.email === user.email;
        });
        if (idx !== -1) users[idx] = user;
        localStorage.setItem("novio_users", JSON.stringify(users));
        $("#avatarImg").attr("src", e.target.result).show();
        $("#avatarInitials").hide();
        showToast("Profile photo updated!", "success");
      };
      reader.readAsDataURL(file);
    });

    $("#resumeUpload").on("change", function () {
      var file = this.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        showToast("Resume must be under 5MB", "error");
        return;
      }
      user.resumeName = file.name;
      setCurrentUser(user);
      var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
      var idx = users.findIndex(function (u) {
        return u.email === user.email;
      });
      if (idx !== -1) users[idx] = user;
      localStorage.setItem("novio_users", JSON.stringify(users));
      $("#resumeFileName").text(file.name);
      showToast("Resume uploaded!", "success");
    });

    $(".account-nav a").on("click", function (e) {
      e.preventDefault();
      $(".account-nav a").removeClass("active");
      $(this).addClass("active");
      var target = $(this).attr("href");
      $(".account-tab").addClass("d-none");
      $(target).removeClass("d-none");
    });

    $("#editProfileForm").on("submit", function (e) {
      e.preventDefault();
      user.name = $("#editName").val().trim();
      user.email = $("#editEmail").val().trim();
      user.phone = $("#editPhone").val().trim();
      user.bio = $("#editBio").val().trim();
      user.address = $("#editAddress").val().trim();
      setCurrentUser(user);

      var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
      var idx = users.findIndex(function (u) {
        return u.email === user.email;
      });
      if (idx !== -1) users[idx] = user;
      localStorage.setItem("novio_users", JSON.stringify(users));

      $("#accName").text(user.name);
      $("#avatarInitials").text(
        user.name
          .split(" ")
          .map(function (n) {
            return n[0];
          })
          .join("")
          .toUpperCase()
          .substring(0, 2),
      );
      showToast("Profile updated!", "success");
    });

    $("#socialLinksForm").on("submit", function (e) {
      e.preventDefault();
      user.socialGithub = $("#socialGithub").val().trim();
      user.socialLinkedin = $("#socialLinkedin").val().trim();
      user.socialFacebook = $("#socialFacebook").val().trim();
      user.socialWebsite = $("#socialWebsite").val().trim();
      setCurrentUser(user);
      var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
      var idx = users.findIndex(function (u) {
        return u.email === user.email;
      });
      if (idx !== -1) users[idx] = user;
      localStorage.setItem("novio_users", JSON.stringify(users));
      showToast("Social links saved!", "success");
    });

    $("#changePasswordForm").on("submit", function (e) {
      e.preventDefault();
      var currentPw = $("#currentPassword").val();
      var newPw = $("#newPassword").val();
      var confirmPw = $("#confirmNewPassword").val();

      if (currentPw !== user.password) {
        showToast("Current password is incorrect", "error");
        return;
      }

      if (newPw.length < 8) {
        showToast("New password must be at least 8 characters", "error");
        return;
      }

      if (newPw !== confirmPw) {
        showToast("New passwords do not match", "error");
        return;
      }

      user.password = newPw;
      setCurrentUser(user);

      var users = JSON.parse(localStorage.getItem("novio_users") || "[]");
      var idx = users.findIndex(function (u) {
        return u.email === user.email;
      });
      if (idx !== -1) users[idx] = user;
      localStorage.setItem("novio_users", JSON.stringify(users));

      showToast("Password changed successfully!", "success");
      this.reset();
    });

    var enrollments = JSON.parse(
      localStorage.getItem("novio_enrollments") || "[]",
    );
    if (enrollments.length > 0) {
      var enrollHtml = "";
      enrollments.forEach(function (item) {
        enrollHtml +=
          '<div class="enrolled-course">' +
          '<img src="' +
          item.image +
          '" alt="' +
          item.title +
          '">' +
          '<div class="course-info">' +
          "<h6>" +
          item.title +
          "</h6>" +
          '<div class="progress"><div class="progress-bar" style="width:' +
          item.progress +
          '%"></div></div>' +
          '<span class="progress-text">' +
          item.progress +
          "% complete</span>" +
          "</div>" +
          "</div>";
      });
      $("#enrolledCourses").html(enrollHtml);
    } else {
      $("#enrolledCourses").html(
        '<div class="text-center py-4">' +
          '<p class="text-muted">No courses enrolled yet.</p>' +
          '<a href="courses.html" class="btn btn-primary btn-sm">Browse Courses</a>' +
          "</div>",
      );
    }

    $("#logoutBtn").on("click", function () {
      logoutUser();
    });
  }
});
