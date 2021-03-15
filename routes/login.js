const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database.js');


// post route for login form
// TODO: confirm middelware name
router.post('/', (req, res) => {
    // TODO: confirm form names
    const email = req.body['login-email'].toLowerCase()
    const password = req.body['login-password']

    if (email && password) {
        db.oneOrNone('SELECT user_id, lower(email), password, is_active FROM users WHERE email = $1 AND is_active = true', [email])
        .then((user) => {
            if (user !== null) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result) {
                        // create user id session data for logged in user
                        req.session.userId = user['user_id']
                        return res.redirect('back')
                    } else {
                        // TODO: add conditional to home and details page that immediately shows the modal if there is a message query in the URL
                        // return res.redirect('/?message=Incorrect%20email%20or%20password.')
                        return res.render('pages/error', {
                            err: {message: 'Incorrect email or password'}
                        })
                    }
                })
            } else {
                // TODO: add conditional to home and details page that immediately shows the modal if there is a message query in the URL
                // return res.redirect('/?message=Incorrect%20email%20or%20password.')
                return res.render('pages/error', {
                    err: {message: 'Incorrect email or password'}
                })
            }
        })
        .catch((err) => {
            return res.render('pages/error', {
                err: err
            })
        })      
    } else {
        // TODO: add conditional to home and details page that immediately shows the modal if there is a message query in the URL
        // res.redirect('/?message=Please%20insert%20both%20email%20and%20password.')
        return res.render('pages/error', {
            err: {message: 'Insert both email and password'}
        })
    }
})


module.exports = router;