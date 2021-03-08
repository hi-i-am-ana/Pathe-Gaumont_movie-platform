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
    const fnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ'])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+$/.test(firstname)
    const lnValid = /^([A-Za-zÀ-ÖØ-öø-ÿ'])+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+( |-)?([A-Za-zÀ-ÖØ-öø-ÿ'?]?)+$/.test(lastname)
    const eValid = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(email)
    const pValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(password)

    let newUser = {}
    let message = 'There was an error signing up.'
    

    db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
    .then((user) => {
        let valid = true
        
        if (fnValid && lnValid && eValid && pValid === false) {
            message = 'Inputs are invalid.'
            valid = false
        } else if (password !== confirmPassword) {
            message = 'Passwords do not match.'
            valid = false
        } else if (user.length === 1) {
            message = 'User already exists.'
            valid = false
        }

        if (!valid) {
            res.redirect(`/signup?message=${message}`)
        } else {
            bcrypt.hash(password, 10, function(err, hash) {
                newUser = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email.toLowerCase(),
                    password: hash
                }
                // TODO: email confirmation
                // TODO: confirm database fields
                db.none('INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2, $3, $4);', [newUser.firstname, newUser.lastname, newUser.email, newUser.password])
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
        }
    })
    .catch((err) => {
        res.render('pages/error', {
            err: err
        })
    })
})


module.exports = router;