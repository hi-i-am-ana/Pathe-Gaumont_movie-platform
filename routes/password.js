const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../db/database.js");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const { sendgrid_api_key } = require("../config");

// post route for password forgot page
router.post("/", (req, res) => {
  const email = req.body["forgot-pass-email"];

  // check if this user email exists
  db.oneOrNone("SELECT * FROM users WHERE email = $1", email)
    .then((user) => {
      let valid = true;

      if (user !== null && user.is_active === true) {
        db.none("DELETE FROM password_reset WHERE email = $1", user.email)
          .then(() => {
            // generate a hash for password reset link
            const passwordResetHash = crypto.randomBytes(30).toString("hex");
            db.none(
              "INSERT INTO password_reset (email, hash) VALUES ($1, $2)",
              [user.email, passwordResetHash]
            );
            return passwordResetHash;
          })
          .then((passwordResetHash) => {
            // create reuseable transporter object
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              auth: {
                user: "pathe.gaumont.1@gmail.com",
                pass: "PathePassword123",
              },
            });

            // specify url
            let url;
            if (process.env.SSL) {
              url = `https://immense-forest-31861.herokuapp.com`;
            } else {
              url = `http://localhost:${process.env.PORT}`;
            }

            // specify email content
            const emailHTML = `
            <p>Hi ${user.firstname},</p>
            <p>To reset your password, please click on the link below.</p>
            <a href="${url}/password/reset/${passwordResetHash}">${url}/password/reset/${passwordResetHash}</a>
            `;

            // send email
            const mailOptions = {
              from: '"Pathé Gaumont" <caterina.turnbull@gmail.com>',
              to: `${user.email}`,
              subject: "Password Reset",
              html: emailHTML,
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log("ERROR");
              } else {
                console.log("OK");
              }
            });
          })
          .then(() => {
            return res.render("pages/passwordForgot", {
              title: "Forgot Password | No CAAP",
            });
          })
          .catch((err) => {
            res.render("pages/error", {
              err: err,
            });
          });
      } else if (user.is_active === false) {
        valid = false;
        message =
          "Your account has not been activated. Please confirm your email first.";
      } else {
        valid = false;
        message = "User does not exist, please sign up";
      }

      if (!valid) {
        res.render("pages/error", {
          err: { message: message },
        });
      }
    })
    .catch((err) => {
      res.render("pages/error", {
        err: err,
      });
    });
});

// get route for password reset page
router.get("/reset/:id", (req, res) => {
  res.render("pages/passwordReset", {
    title: "Password Reset | No CAAP",
    passwordResetHash: req.params.id,
  });
});

// post route for password reset page
router.post("/reset/:id", (req, res) => {
  const newPassword = req.body["new-password"];
  const confirmNewPassword = req.body["confirm-new-password"];

  // validate password
  const pValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(
    newPassword
  );

  if (pValid === false) {
    message = "Invalid password";
    res.render("pages/error", {
      err: { message: "Invalid password" },
    });
  } else if (newPassword !== confirmNewPassword) {
    res.render("pages/error", {
      err: { message: "Passwords do not match" },
    });
  } else {
    // password validated
    db.one("SELECT * FROM password_reset WHERE hash = $1;", req.params.id)
      .then((user) => {
        bcrypt.hash(newPassword, 10, (err, hash) => {
          // update new password
          db.none("UPDATE users SET password = $1 WHERE email = $2;", [
            hash,
            user.email,
          ])
            .then(() => {
              db.none(
                "DELETE from password_reset WHERE hash = $1;",
                req.params.id
              ).catch((err) => {
                res.render("pages/error", {
                  err: err,
                });
              });
              res.render("pages/passwordResetConfirmation");
            })
            .catch((err) => {
              res.render("pages/error", {
                err: err,
              });
            });
        });
      })
      .catch((err) => {
        res.render("pages/error", {
          err: err,
        });
      });
  }
});

module.exports = router;
