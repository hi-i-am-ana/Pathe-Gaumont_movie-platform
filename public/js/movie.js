// for API request from TMDB and front-end stuff

//const api_key = "cfefc3e8ca19cda5321de4a1caac0c85";

/*console.log("HELLO WORLD! FROM movie.js");
$(document).ready(function () {
  $.getJSON(`/${movie.id}`).then((data) => {
    console.log("THIS IS MY DATA: " + data);
  });
  /*const getMovieDetails = function () {
    $.getJSON(`/${movie.id}`).then((data) => {
      // get the movie id
      console.log("THIS IS MY DATA: " + data);
      console.log("THIS IS MY MOVIE ID: " + data.movie_id);
    });

    $.getJSON(
      `https://api.themoviedb.org/3/movie/587807?api_key=${api_key}`
    ).then((movie) => {
      console.log("TESTING!!!");
      console.log(movie.original_title);
      getMovieDetails(movie);
    });
  };
});*/

// function definition
const displayMovieDetails = (data) => {
  console.log(data);
  // left container: poster, movie title, genres, and release date
  let backdropUrl = `https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`;
  //$(".right-container").css("background", "url(" + backdropUrl + ")");
  $(".right-container").css({
    background:
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))" +
      ", " +
      "url(" +
      backdropUrl +
      ")",
    "background-repeat": "no-repeat",
    "background-size": "cover",
  });

  let posterUrl = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
  let releaseYear = data.release_date.slice(0, 4);
  let genres = [];
  $.each(data.genres, (i, genre) => {
    genres.push(genre.name);
  });

  $.getJSON(`/${movie_id}`).then((data) => {
    communityRating = data.communityRating;
    numberOfVotes = data.numberOfVotes;
    console.log(communityRating + "(" + numberOfVotes + ")");
    $(".rating").text(communityRating + " (" + numberOfVotes + " reviews)");
  });

  let movieDetailsLeft = `
  <img src="${posterUrl}" alt="${data.title}">
  <h1>${data.title} (${releaseYear})</h1>
  <h3>Release date:</h3>
  <p>${data.release_date}</p>
  <h3>Genres:</h3>
  <p>${genres.join(", ")}</p>
  <h3>Runtime:</h3>
  <p>${data.runtime} minutes</p>
  `;

  $(".left-container").html(movieDetailsLeft);

  // right container: video, ratings, and overview
  let movieDetailsRight = `
  <h3>Overview:</h3>
  <p>${data.overview}</p>
  <h3>Cast:</h3>
  `;

  $(".right-container").append(movieDetailsRight);
};

//get movie's details
$.getJSON(
  `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`,
  function (data) {
    displayMovieDetails(data);
  }
).catch((err) => {});

// get movie's video
$.getJSON(
  `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${api_key}&language=en-US`,
  function (data) {
    let videoURL = "";
    if (data.results[0].site === "YouTube") {
      videoURL = `https://www.youtube.com/embed/${data.results[0].key}`;
    } else if (data.results[0].site === "Vimeo") {
      videoURL = `https://vimeo.com/${data.results[0].key}`;
    }
    //$("test2").text(data.key);
    $(".movie-video").attr("src", videoURL);
  }
).catch((err) => {});

// get movie's cast
$.getJSON();

/*$.getJSON(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`)
  .then((data) => {
    console.log(data);
    console.log(data.title);
    displayMovieDetails(data);
  })
  .catch((err) => {
    console.log(err);
  });
*/
/*$.getJSON(`/${movie.id}`).then((data) => {
  console.log("HERE IS THE DATA IN JSON: " + data);
});
*/
