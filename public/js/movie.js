// for API request from TMDB and front-end stuff

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

  displayRatingStars()

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

// TODO: get movie's cast
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

// rating hover for logged in users
$(".rating-container.individual-movie a").mouseover(function() {
  $(this).prevAll().find("i").css("color", "orange");
  $(this).find("i").css("color", "orange");
  $(this).nextAll().find("i").css("color", "grey");
});

$(".rating-container.individual-movie").mouseleave(function () { 
  $(this).find("i").css("color", "");
});

// ajax request to send rating to db
$(".rating-container.individual-movie a").click(function(e) {
  e.preventDefault();
  $.getJSON(`/movie/allratings/${movie_id}`)
  .then((data) => {
    // prevents voting more than once
    if (data.length !== 0) {
      $(".rating-container.individual-movie .alert").text("You have already rated this movie, you cannot rate again.")
    } else {
      const rating = $(".rating-container.individual-movie a").index(this) + 1
      $.post( `/movie/rate/${movie_id}?rating=${rating}`)
      .done(function() {
        setTimeout(displayRatingStars, 300)
        $(".rating-container.individual-movie .alert").text("Thank you for rating this movie!")
      })
      .fail(function() {
        $(".rating-container.individual-movie .alert").text("There was an error submitting your rating, please try again.")
      })
    }
  })
  .catch((err) => {
    $(".rating-container.individual-movie .alert").text("There was an error submitting your rating, please try again.")
  })
})

function displayRatingStars() {
  // star display ratings
  $.getJSON(`/ratings/${movie_id}`).then((data) => {
    communityRating = data.communityRating;
    numberOfVotes = data.numberOfVotes;
    starSelector = Number(communityRating.toString()[0]) + 1;

    if (communityRating.toString().length > 1) {
      communityRatingPercentage = communityRating.toString()[2] + "0%";
    } else {
      communityRatingPercentage = undefined
    }

    if (numberOfVotes !== 0) {
      $(".rating").text(communityRating + " (" + numberOfVotes + " reviews)");
      $(`.rating-container.individual-movie i:nth-child(${starSelector})`).prevAll().append(
        `<i class="fas fa-star filled"></i>`
      );
      $(`.rating-container.individual-movie a:nth-child(${starSelector})`).prevAll().find("i").append(
        `<i class="fas fa-star filled"></i>`
      )
      if (communityRatingPercentage !== undefined) {
        $(`.rating-container.individual-movie i:nth-child(${starSelector}), .rating-container.individual-movie a:nth-child(${starSelector}) i`).append(
          `<i class="fas fa-star filled" style="width:${communityRatingPercentage}"></i>`
        );
      }
    } else {
      $(".rating").text("(" + numberOfVotes + " reviews)");
    }
  });
}
