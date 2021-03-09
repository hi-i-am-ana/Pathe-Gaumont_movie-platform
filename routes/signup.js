const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database.js');


// post new user
//TODO: confirm redirect middleware name
router.post('/', (req, res) => {

    const firstname = req.body['first-name']
    const lastname = req.body['last-name']
    const email = req.body['signup-email']
    const password = req.body['signup-password']
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
        console.log('first db query fired')
        console.log(password)
        console.log(confirmPassword)
        
        if (fnValid && lnValid && eValid && pValid === false) {
            message = 'Inputs are invalid.'
            valid = false
            console.log('invalid')
        } else if (password !== confirmPassword) {
            message = 'Passwords do not match.'
            valid = false
            console.log('password dont match')
            // HERE
        } else if (user !== null) {
            message = 'User already exists.'
            valid = false
            console.log('user already exists')
        }

        if (!valid) {
            // res.redirect(`/signup?message=${message}`)
            return res.render('pages/error', {
                err: message
            })
        } else {
            console.log('everything valid')
            bcrypt.hash(password, 10, function(err, hash) {
                console.log('password encrypted')
                newUser = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email.toLowerCase(),
                    password: hash
                }
                // TODO: email confirmation
                // TODO: confirm database fields
                db.none('INSERT INTO users(firstname, lastname, email, password, is_active) VALUES ($1, $2, $3, $4, false);', [newUser.firstname, newUser.lastname, newUser.email, newUser.password])
                .then (() => {
                    console.log('second db query fired')
                    // TODO: choose action after signup
                    // return res.redirect('/?message=Sign%20up%20successful.')
                    return res.redirect('/')
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