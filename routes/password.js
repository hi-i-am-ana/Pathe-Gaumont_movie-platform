const express = require("express");
const router = express.Router();
const db = require("../db/database.js");

router.get("/forgotten-password", (req, res) => {
  const email = req.body["forgot-pass-email"];

  console.log("YOUR EMAIL IS: " + email);
});
