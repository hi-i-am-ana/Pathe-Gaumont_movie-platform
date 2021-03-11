const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../db/database.js");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const cron = require('node-cron');


// post new user
//TODO: confirm redirect middleware name
router.post("/", (req, res) => {
  const firstname = req.body["first-name"];
  const lastname = req.body["last-name"];
  const email = req.body["signup-email"];
  const password = req.body["signup-password"];
  const confirmPassword = req.body["confirm-password"];

  // validate
  const fnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ'])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+$/.test(firstname);
  const lnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ'])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+$/.test(lastname);
  const eValid = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(email);
  const pValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password);

  let newUser = {};
  let message = "There was an error signing up.";

  db.oneOrNone("SELECT * FROM users WHERE email = $1", email)
  .then((user) => {
    let valid = true;

    if (fnValid && lnValid && eValid && pValid === false) {
      message = "Inputs are invalid.";
      valid = false;
    } else if (password !== confirmPassword) {
      message = "Passwords do not match.";
      valid = false;
    } else if (user !== null) {
      message = "User already exists.";
      valid = false;
    }

    if (!valid) {
      // TODO: add conditional to home and details page that immediately shows the modal if there is a message query in the URL
      // res.redirect(`/signup?message=${message}`)
      return res.render("pages/error", {
        err: { message: message },
      });
    } else {
      bcrypt.hash(password, 10, function (err, hash) {
        newUser = {
          firstname: firstname,
          lastname: lastname,
          email: email.toLowerCase(),
          password: hash,
        };

        db.none("INSERT INTO users(firstname, lastname, email, password, is_active) VALUES ($1, $2, $3, $4, false)", [newUser.firstname, newUser.lastname, newUser.email, newUser.password])
        .then(() => {
          const confirmationHash = crypto.randomBytes(30).toString('hex');

          db.none("INSERT INTO email_confirmation(email, hash) VALUES ($1, $2)", [newUser.email, confirmationHash])
          .then(() => {
            const transport = nodemailer.createTransport(
              nodemailerSendgrid({
                apiKey: process.env.SENDGRID_API_KEY,
              })
            );

              // TODO: Add link to resend email
            const emailHTML = `
            <!-- <img src="/static/assets/Logo.png" alt="No CAAP Logo" style="display:block;"> -->
            <h2>Thank you for signing up with No CAAP</h2>
            <p>To verify your account, please click on the link below.</p>
            <p><a href="http://localhost:${process.env.PORT}/email/${confirmationHash}">http://localhost:${process.env.PORT}/email/${confirmationHash}</a></p>
            <p>This link will expire in 48 hours.</p>
            <footer>2021 © No CAAP</footer>
            `
  
            transport.sendMail({
              from: '"Pathé Gaumont" <caterina.turnbull@gmail.com>',
              to: newUser.email,
              subject: "Signup Confirmation",
              text: `Thank you for signing up with No CAAP. To verify your account, please use the following link. http://localhost:${process.env.PORT}/email/${confirmationHash}`,
              html: emailHTML
            }, function (err) {
              if (err) {
                return res.render("pages/error", {
                  err: {message: "Email failed to send, please try again."},
                });
              }
            });
          })   
        })
        .then(() => {
          // TODO: add conditional to home and details page that immediately shows the modal if there is a message query in the URL
          // return res.redirect('/?message=Sign%20up%20successful.')
          return res.render("pages/signupConfirmation")
        })
        .catch((err) => {
          return res.render("pages/error", {
            err: err,
          });
        });
      });
    }
  })
  .catch((err) => {
    res.render("pages/error", {
      err: err,
    });
  });
});

// Delete hashes after 48 hours - this runs every minute and not sure if it's bad to run it this often
cron.schedule('* * * * *', () =>{
  db.any("SELECT * FROM email_confirmation")
  .then((rows) => {
    if (rows.length > 0) {
      db.none("DELETE FROM email_confirmation WHERE create_at < now() - interval '2 days'")
      .then(() => {
        console.log("Hash deleted")
      })
      .catch(() => {
        console.log("Cron tried to delete hash and it didn't work.")
      })
    }
  })
})

module.exports = router;
