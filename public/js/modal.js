document.addEventListener("DOMContentLoaded", () => {
  $(".close-modal").click(modalToggle);
  $(".open-modal").click(modalToggle);
  $(".toggle-signup").click(toggleSignUp);
  $(".toggle-login").click(toggleLogIn);
  $("#forgotten-password").click(toggleForgottenPassword);

  $("#login-password + .password-toggle").click(passwordToggle1);
  $("#signup-password + .password-toggle").click(passwordToggle2);
  $("#confirm-password + .password-toggle").click(passwordToggle3);
  $("#new-password + .password-toggle").click(passwordToggle4);
  $("#confirm-new-password + .password-toggle").click(passwordToggle5);

  function modalToggle() {
    const blur = document.getElementById("blur");
    blur.classList.toggle("active");
    const modal = document.querySelector(".modal");
    modal.classList.toggle("active");
  }

  function toggleForgottenPassword() {
    $(".forgotten-password").removeClass("hidden");
    $(".login").addClass("hidden");
    $(".signup").addClass("hidden");
  }

  function toggleSignUp() {
    $(".forgotten-password").addClass("hidden");
    $(".login").addClass("hidden");
    $(".signup").removeClass("hidden");
  }

  function toggleLogIn() {
    $(".forgotten-password").addClass("hidden");
    $(".login").removeClass("hidden");
    $(".signup").addClass("hidden");
  }

  function passwordToggle1() {
    const password = document.querySelector("#login-password");
    const togglePassword = document.querySelector("#login-password + i.fas");
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  }

  function passwordToggle2() {
    const password = document.querySelector("#signup-password");
    const togglePassword = document.querySelector("#signup-password + i.fas");
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  }

  function passwordToggle3() {
    const password = document.querySelector("#confirm-password");
    const togglePassword = document.querySelector("#confirm-password + i.fas");
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  }

  function passwordToggle4() {
    const password = document.querySelector("#new-password");
    const togglePassword = document.querySelector("#new-password + i.fas");
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  }

  function passwordToggle5() {
    const password = document.querySelector("#confirm-new-password");
    const togglePassword = document.querySelector(
      "#confirm-new-password + i.fas"
    );
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";

    password.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  }
});
