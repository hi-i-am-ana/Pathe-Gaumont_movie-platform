const passwordResetForm = document.getElementById("reset-password-form");
const newPassword = document.getElementById("new-password");
const confirmNewPassword = document.getElementById("confirm-new-password");

passwordResetForm.addEventListener("submit", (e) => {
  if (!checkPasswordResetInput()) {
    e.preventDefault();
  }
});

function checkPasswordResetInput() {
  const newPasswordValue = newPassword.value;
  const confirmNewPasswordValue = confirmNewPassword.value;

  if (newPasswordValue === "") {
    setErrorFor(newPassword, "Password cannot be blank");
  } else if (!isPassword(newPasswordValue)) {
    setErrorFor(
      newPassword,
      "At least six characters, lower and uppercase letter and numbers"
    );
  } else {
    setSuccessFor(newPassword);
  }

  if (confirmNewPasswordValue === "") {
    setErrorFor(confirmNewPassword, "Password cannot be blank");
  } else if (newPasswordValue != confirmNewPasswordValue) {
    setErrorFor(confirmNewPassword, "Password does not match");
  } else {
    setSuccessFor(confirmNewPassword, "Password is a match");
  }
  return true;
}
