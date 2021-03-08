const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database.js');


// post route for login form
// TODO: confirm middelware name
router.post('/', redirectHome, (req, res) => {
    // TODO: confirm form names
    const email = req.body.email.toLowerCase()
    const password = req.body.password

    if (email && password) {
        // TODO: confirm database fields
        db.any('SELECT user_id, lower(email), password FROM users WHERE email = $1', [email])
        .then((user) => {
            if (user.length === 1) {
                bcrypt.compare(password, user[0].password, function(err, result) {
                    if (result) {
                        // create user id session data for logged in user
                        req.session.userId = user[0].id
                        return res.redirect('/')
                    } else {
                        return res.redirect('/login?message=Incorrect%20email%20or%20password.')
                    }
                })
            } else {
                return res.redirect('/login?message=Incorrect%20email%20or%20password.')
            }
        })
        .catch((err) => {
            return res.render('pages/error', {
                layout: './layouts/login-layout',
                err: err
            })
        })      
    } else {
        res.redirect('/login?message=Please%20insert%20both%20email%20and%20password.')
    }
})


module.exports = router;