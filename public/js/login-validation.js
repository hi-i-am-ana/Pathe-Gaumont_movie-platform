const loginForm = document.getElementById("login-form");
const emailOne = document.getElementById("login-email");
const passwordOne = document.getElementById("login-password");


loginForm.addEventListener("submit", e => {
  if (!checkLoginInput())
    e.preventDefault();

});

function checkLoginInput() {
  const emailValueOne = emailOne.value;
  const passwordValueOne = passwordOne.value;

  if (emailValueOne === "") {
    setErrorFor(emailOne, "Email address cannot be blank");
  } else if (!isEmail1(emailValueOne)) {
    setErrorFor(emailOne, "Email is not a valid address");
  } else {
    setSuccessFor(emailOne);
  }

  if (passwordValueOne === "") {
    setErrorFor(passwordOne, "Password cannot be blank");
  } else {
    setSuccessFor(passwordOne);
  }
  return true;

}