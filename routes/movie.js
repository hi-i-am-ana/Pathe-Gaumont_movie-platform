// for database querying and server-side stuff

const express = require("express");
const router = express.Router();
const db = require("../db/database.js");
const { api_key } = require("../config");

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

module.exports = router;

/*router.get("/", (req, res) => {
  res.render("pages/movie", {
    currentUser: req.session.userId,
    // TODO: Change the title to include the movie title (name)
    title: "Movie | No CAAP",
    api_key: api_key,
  });
});*/
