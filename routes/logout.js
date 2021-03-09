const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.render('pages/error', {
                err: err
            })
        } else {
            res.clearCookie('connect.sid')
            res.redirect('back')
        }
    })
})




module.exports = router;