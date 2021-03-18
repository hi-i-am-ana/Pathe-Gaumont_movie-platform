// TRIGGER

function setErrorFor(input, message) {
  const formControl = input.parentElement; //form-control
  const errorMessage = formControl.querySelector("small");
  errorMessage.innerText = message;
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

//REG EXPRESSION//

function isEmail(emailInput) {
  const add = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return add.test(emailInput);
}

function isPassword(passwordInput) {
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  return re.test(passwordInput);
}

function isEmail1(inputEmail) {
  const add = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return add.test(inputEmail);
}

$(".formcontrol > input ").change = checkLoginInput();
$(".formcontrol > input ").change = checkInputs();
$(".formcontrol > input ").change = checkPasswordResetInput();
$("#login-form").attr("novalidate", "");
$("#signup-form").attr("novalidate", "");
$("#reset-password-form").attr("novalidate", "");
document.getElementById("login-form").noValidate = true;
document.getElementById("signup-form").noValidate = true;
document.getElementById("reset-password-form").noValidate = true;
