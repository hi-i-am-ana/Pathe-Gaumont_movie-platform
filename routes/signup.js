const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database.js');


// post new user
//TODO: confirm redirect middleware name
router.post('/', redirectHome, (req, res) => {

    const {firstname, lastname, email, password} = req.body
    // TODO: confirm "confirm password" field name
    const confirmPassword = req.body['confirm-password']

    // validate
    const fnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ?]?)+$/.test(firstname)
    const lnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ?]?)+$/.test(lastname)
    const eValid = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(email)
    const pValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password)

    let newUser = {}
    

    db.any('SELECT * FROM users;')
    .then((users) => {
        if (fnValid && lnValid && eValid && pValid) {
            if (password === confirmPassword) {
                const exists = users.some(user => user.email === email.toLowerCase())
                if (!exists) {
                    bcrypt.hash(password, 10, function(err, hash) {
                        newUser = {
                            firstname: firstname,
                            lastname: lastname,
                            email: email.toLowerCase(),
                            password: hash
                        }
                        db.none('INSERT INTO users(firstname, surname, email, password) VALUES ($1, $2, $3, $4);', [newUser.firstname, newUser.surname, newUser.email, newUser.password])
                        .then (() => {
                            // TODO: choose action after signup
                            return res.redirect('/login?message=Signup%20successful.')
                        })
                        .catch((err) => {
                            return res.render('pages/error', {
                                err: err
                            })
                        })
                    })
                } else {
                    // TODO: choose redirect url
                    res.redirect('/signup?message=User%20already%20exists.')
                }
            } else {
                // TODO: choose redirect url
                res.redirect('/signup?message=Passwords%20do%20not%20match.')
            }
        } else {
            // TODO: choose redirect url
            res.redirect('/signup?message=Form%20is%20not%20valid.')
        }
    })
    .catch((err) => {
        res.render('pages/error', {
            err: err
        })
    })
})


module.exports = router;