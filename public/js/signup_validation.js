// const form = document.getElementById("signup-form");
// const lastName = document.getElementById("last_nameInput");
// const firstName = document.getElementById("first_nameInput");
// const email = document.getElementById("emailInput");
// const password = document.getElementById("passwordInput");
// const confirmPassword = document.getElementById("confirmPasswordInput");

//NEEDS TO BE CHANGE
form.addEventListener('submit', e => {

  if (!checkInputs()) {
    e.preventDefault()
  }

});

function checkInputs() {
  const lastNameValue = lastName.value;
  const firstNameValue = firstName.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  if (lastNameValue === "") {
    setErrorFor(last_nameInput, "Last name is required");
  } else {
    setSuccessFor(last_nameInput);
  }

  if (firstNameValue === "") {
    setErrorFor(first_nameInput, "First name is required");
  } else {
    setSuccessFor(first_nameInput);
  }

  if (emailValue === "") {
    setErrorFor(emailInput, "Email address cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(emailInput, "Email is not a valid address");
  } else {
    setSuccessFor(emailInput);
  }

  if (passwordValue === "") {
    setErrorFor(passwordInput, "Password cannot be blank");
  } else if (!isPassword(passwordValue)) {
    setErrorFor(passwordInput, "At least six characters, lower and uppercase letter and numbers")
  } else {
    setSuccessFor(passwordInput);
  }


  if (confirmPasswordValue === "") {
    setErrorFor(confirmPasswordInput, "Password cannot be blank");
  } else if (passwordValue != confirmPasswordValue) {
    console.log("this is", passwordValue)
    console.log("this is confirm", confirmPasswordValue)
    setErrorFor(confirmPasswordInput, "Password does not match");
  } else {
    setSuccessFor(confirmPasswordInput, "Password is a match");
  }
  return true;
}