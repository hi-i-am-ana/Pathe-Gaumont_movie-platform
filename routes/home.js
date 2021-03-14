const express = require('express');
const router = express.Router();
const db = require('../db/database.js');
const { api_key } = require('../config');

router.get('', (req, res) => {
  res.render('pages/home', {
    currentUser: req.session.userId,
    title: 'Home | No CAAP',
    api_key: api_key,
  });
});

router.get('/ratings/:id', (req,res) => {
  db.any('SELECT rating_value FROM ratings WHERE movie_id = $1', req.params.id)
  .then(ratings => {
    console.log(ratings)
    if (ratings.length !== 0) {
      console.log(`inside if for ${req.params.id}`)
      const reducedRatings = ratings.reduce((accu, curval) => accu + curval.rating_value, 0);
      const communityRating = reducedRatings/ratings.length;
      res.json({movie_id: req.params.id, communityRating: communityRating, numberOfVotes: ratings.length});
    } else {
      // Do I need this else??? Without it community rating will be null, but I don't show rating if it's 0
      console.log(`inside else for ${req.params.id}`)
      res.json({movie_id: req.params.id, communityRating: 0, numberOfVotes: 0});
    };
  })
  .catch((err) => res.render('pages/error', {
    err: err,
    title: 'Error | No CAAP'
  }));
});

module.exports = router;
