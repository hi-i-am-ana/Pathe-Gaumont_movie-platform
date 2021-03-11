const express = require("express")
const router = express.Router()
const db = require("../db/database.js")


router.get('^/:id([a-z0-9]{60})$', (req, res) => {
    db.oneOrNone('SELECT email FROM email_confirmation WHERE hash = $1', req.params.id)
    .then ((user) => {
        if (user !== null) {
            db.none('UPDATE users SET is_active = true WHERE email = $1', user.email)
            .then (() => {
                db.none('DELETE FROM email_confirmation WHERE hash = $1', req.params.id)
                .then (() => {
                    res.render('pages/emailconfirmation', {
                        email: user.email
                    })
                })
                .catch((err) => {
                    res.render('pages/error', {
                        err: err
                    })
                })
            })
            .catch ((err) => {
                res.render('pages/error', {
                    err: err
                })
            })
        } else {
            // no hash error
            res.render('pages/error', {
                err: {message: 'No such hash'}
            })
        }
    })
    .catch ((err) => {
        res.render('pages/error', {
            err: err
        })
    })
})



module.exports = router;