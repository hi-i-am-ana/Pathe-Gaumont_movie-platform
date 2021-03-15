// for database querying and server-side stuff

const express = require("express");
const router = express.Router();
const db = require("../db/database.js");
const { api_key } = require("../config");
const querystring = require('querystring');

/*router.get("/movie", (req, res) => {
  res.render("pages/movie", {
    currentUser: req.session.userId,
    title: "Movie | No CAAP",
    api_key: api_key,
  });
});*/

router.get("/:id", (req, res) => {
  db.any("SELECT rating_value FROM ratings WHERE movie_id = $1", req.params.id)
    .then((ratings) => {
      // if the movie has been voted
      if (ratings.length !== 0) {
        // add up all the rating values
        const reducedRatings = ratings.reduce(
          (accu, curval) => accu + curval.rating_value,
          0
        );
        const communityRating = reducedRatings / ratings.length;
        // return the rating and the number of votes in json data
        res.render("pages/movie", {
          currentUser: req.session.userId,
          title: "Movie | No CAAP",
          api_key: api_key,
          movie_id: req.params.id,
          communityRating: communityRating,
          numberOfVotes: ratings.length,
        });
        /*res.json({
          movie_id: req.params.id,
          communityRating: communityRating,
          numberOfVotes: ratings.length,
        });*/
      } else {
        res.render("pages/movie", {
          currentUser: req.session.userId,
          title: "Movie | No CAAP",
          api_key: api_key,
          movie_id: req.params.id,
          communityRating: 0,
          numberOfVotes: 0,
        });
        /*res.json({
          movie_id: req.params.id,
          communityRating: 0,
          numberOfVotes: 0,
        });*/
      }
    })
    .catch((err) =>
      res.render("pages/error", {
        err: err,
        title: "Error | No CAAP",
      })
    );
});

router.get("/rate/:id", (req, res) => {
  const currentUser = req.session.userId

  if (currentUser) {
    db.none("INSERT INTO ratings(movie_id, user_id, rating_value, create_at, update_at) VALUES ($1, $2, $3, now(), now())", [req.params.id, currentUser, req.query.rating])
    .then(() => {
      res.redirect(`/movie/${req.params.id}`)
    })
    .catch(() => {
      res.render("pages/error", {
        err: err,
        title: "Error | No CAAP",
      })
    })
  } else {
    res.status(404).render("pages/error", {
      err: { message: "HTTP ERROR 404. This page does not exist" },
      title: "Error | Pathe Gaumont Movie Platform",
    });
  }
})

module.exports = router;

/*router.get("/", (req, res) => {
  res.render("pages/movie", {
    currentUser: req.session.userId,
    // TODO: Change the title to include the movie title (name)
    title: "Movie | No CAAP",
    api_key: api_key,
  });
});*/
