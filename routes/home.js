const express = require("express");
const router = express.Router();
const db = require("../db/database.js");


router.get('/', (req, res) => {
    res.render('pages/home')
})

module.exports = router;
