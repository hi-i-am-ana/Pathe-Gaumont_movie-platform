// const loginForm = document.getElementById("login-form");
// const emailOne = document.getElementById("inputEmail");
// const passwordOne = document.getElementById("inputPassword");


loginForm.addEventListener("submit", e => {

  if (!checkLoginInput())
    e.preventDefault();

});

function checkLoginInput() {
  const emailValueOne = emailOne.value;
  const passwordValueOne = passwordOne.value;

  if (emailValueOne === "") {
    setErrorFor(inputEmail, "Email address cannot be blank");
  } else if (!isEmail1(emailValueOne)) {
    setErrorFor(inputEmail, "Email is not a valid address");
  } else {
    setSuccessFor(inputEmail);
  }

  if (passwordValueOne === "") {
    setErrorFor(inputPassword, "Password cannot be blank");
  } else {
    setSuccessFor(inputPassword);
  }

  return true;
}
