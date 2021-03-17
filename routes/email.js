const express = require("express")
const router = express.Router()
const db = require("../db/database.js")


router.get('^/:id([a-z0-9]{60})$', (req, res) => {
    db.any("SELECT * FROM email_confirmation WHERE hash = $1 AND create_at < now() - interval '2 days'", req.params.id)
    .then((rows) => {
        if (rows.length > 0) {
            db.none("DELETE FROM email_confirmation WHERE hash = $1 AND create_at < now() - interval '2 days'", req.params.id)
            .then(() => {
                res.render('pages/error', {
                    err: {message: 'Your confirmation link has expired, please click resend in your email.'}
                })
            })
            .catch((err) => {
                res.render('pages/error', {
                    err: err
                })
            })
            
        } else {
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
                    // no hash redirect for after login
                    return res.redirect('/')
                }
            })
            .catch ((err) => {
                res.render('pages/error', {
                    err: err
                })
            })
        }
    })
    .catch((err) => {
        return res.render('pages/error', {
            err: err
        })
    })    
})



module.exports = router;