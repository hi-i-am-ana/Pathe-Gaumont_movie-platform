const express = require("express");
const router = express.Router();
const db = require("../db/database.js");


router.get('/', (req, res) => {
    res.render('pages/home', {
        currentUser: req.session.userId,
        title: 'Home | No CAAP'
    })
})

module.exports = router;
