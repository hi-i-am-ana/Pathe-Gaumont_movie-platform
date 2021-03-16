// for database querying and server-side stuff

const express = require("express");
const router = express.Router();
const db = require("../db/database.js");
const { api_key } = require("../config");
const querystring = require('querystring');
const { query } = require("../db/database.js");

router.get("/:id", (req, res) => {
  db.any("SELECT rating_value FROM ratings WHERE movie_id = $1", req.params.id)
    .then((ratings) => {
        res.render("pages/movie", {
          currentUser: req.session.userId,
          title: "Movie | No CAAP", //rewrites to movie name on front-end
          api_key: api_key,
          movie_id: req.params.id,
        });
    })
    .catch((err) =>
      res.render("pages/error", {
        currentUser: req.session.userId,
        err: err,
        title: "Error | No CAAP",
      })
    );
});

// rate movie
router.post("/rate/:id", (req, res) => {

  db.any("SELECT * FROM ratings WHERE movie_id = $1 AND user_id = $2", [req.params.id, req.session.userId])
  .then((data) => {
    if (data.length === 0) {
      db.none("INSERT INTO ratings(movie_id, user_id, rating_value, create_at, update_at) VALUES ($1, $2, $3, now(), now())", [req.params.id, req.session.userId, req.query.rating])
      .then(() => {
        return res.end()
      })
      .catch((err) => {
        res.render("pages/error", {
          currentUser: req.session.userId,
          err: err,
          title: "Error | No CAAP",
        })
      })
    } else {
      res.render("pages/error", {
        currentUser: req.session.userId,
        err: {message: "You have already rated this movie"},
        title: "Error | No CAAP",
      })
    }
  })
  .catch((err) => {
    res.render("pages/error", {
      currentUser: req.session.userId,
      err: err,
      title: "Error | No CAAP",
    })
  })
})

router.get('/allratings/:id', (req,res) => {
  db.any('SELECT * FROM ratings WHERE movie_id = $1 AND user_id = $2', [req.params.id, req.session.userId])
  .then(ratings => {
      res.json(ratings);
    })
  .catch((err) => res.render('pages/error', {
    currentUser: req.session.userId,
    err: err,
    title: 'Error | No CAAP'
  }));
});

module.exports = router;
