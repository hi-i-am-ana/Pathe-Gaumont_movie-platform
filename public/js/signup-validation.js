const form = document.getElementById("signup-form");
const lastName = document.getElementById("last-name");
const firstName = document.getElementById("first-name");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const confirmPassword = document.getElementById("confirm-password");

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
    setErrorFor(lastName, "Last name is required");
  } else {
    setSuccessFor(lastName);
  }

  if (firstNameValue === "") {
    setErrorFor(firstName, "First name is required");
  } else {
    setSuccessFor(firstName);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email address cannot be blank");
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Email is not a valid address");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be blank");
  } else if (!isPassword(passwordValue)) {
    setErrorFor(password, "At least six characters, lower and uppercase letter and numbers")
  } else {
    setSuccessFor(password);
  }


  if (confirmPasswordValue === "") {
    setErrorFor(confirmPassword, "Password cannot be blank");
  } else if (passwordValue != confirmPasswordValue) {
    console.log("this is", passwordValue)
    console.log("this is confirm", confirmPasswordValue)
    setErrorFor(confirmPassword, "Password does not match");
  } else {
    setSuccessFor(confirmPassword, "Password is a match");
  }
  return true;
}