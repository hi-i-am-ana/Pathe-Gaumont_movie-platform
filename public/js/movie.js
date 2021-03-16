// for API request from TMDB and front-end stuff

// function definition
const displayMovieDetails = (data) => {
  let backdropUrl = `https://image.tmdb.org/t/p/w1280/${data.backdrop_path}`;

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

  // left container: poster, movie title, genres, and release date
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
  <button onclick="location.href='${data.homepage}'">Visit homepage</button>
  `;

  $(".left-container").html(movieDetailsLeft);

  // right container: video, ratings, and overview
  let movieDetailsRight = `
  <h3>Overview:</h3>
  <p>${data.overview}</p>
  <h3>Cast:</h3>
  `;

  $(".right-container").append(movieDetailsRight);
  $(".right-container").append($(".cast-slider-container"))

  // change the page title to the name of the movie
  $("title").text(`${data.title} | No CAAP`)
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

// get movie's cast - top 30 most popular
$.getJSON(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${api_key}`)
.then(data => {
  data.cast.sort((a, b) => b.popularity - a.popularity);
  const Actors = data.cast.slice(0, 30);
  $.each(Actors, (i, actor) => {
    $.getJSON(`https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${api_key}`)
    .then(data => {
      const actorImageUrl = `https://image.tmdb.org/t/p/w45${data.profiles[0].file_path}`;
      return actorImageUrl;
    })
    .then(actorImageUrl => {
      $(".cast-slider-container").append(`
      <div class="cast-item">
      <img src="${actorImageUrl}" alt="${actor.name}">
      <p class="cast-name">${actor.name}</p>
      </div>
      `)
    })
    .catch(err => {
      // display error
    });
  });
})
.catch(err => {
  // display error
});

// rating hover for logged in users
$(".rating-function.logged-in a").mouseover(function() {
  $(this).prevAll().find("i").css("color", "orange");
  $(this).find("i").css("color", "orange");
  $(this).nextAll().find("i").css("color", "grey");
});

$(".rating-function.logged-in").mouseleave(function () { 
  $(this).find("i").css("color", "");
});

// ajax request to send rating to db
$(".rating-function.logged-in a").click(function(e) {
  e.preventDefault();

  $.getJSON(`/movie/allratings/${movie_id}`)
  .then((data) => {
    const rating = $(".rating-function.logged-in a").index(this) + 1
    $.post( `/movie/rate/${movie_id}?rating=${rating}`)
    .done(function() {
      setTimeout(displayRatingStars, 300)
      $(".rating-container.individual-movie .alert").text("Thank you for rating this movie!")
    })
    .fail(function() {
      $(".rating-container.individual-movie .alert").text("There was an error submitting your rating, please try again.")
    })
  })
  .catch((err) => {
    $(".rating-container.individual-movie .alert").text("There was an error submitting your rating, please try again.")
  })
})

// star display ratings
function displayRatingStars() {

  // display community rating when logged out
  $.getJSON(`/ratings/${movie_id}`).then((data) => {
    communityRating = data.communityRating;
    numberOfVotes = data.numberOfVotes;
    starSelector = Number(communityRating.toString()[0]);

    if (communityRating.toString().length > 1) {
      communityRatingPercentage = communityRating.toString()[2] + "0%";
    } else {
      communityRatingPercentage = undefined
    }

    if (numberOfVotes !== 0) {
      $(".rating").text(communityRating + " (" + numberOfVotes + " reviews)");
      $(`.rating-function.logged-out i:nth-child(${starSelector})`).prevAll().addBack().append(
        `<i class="fas fa-star filled"></i>`
      );
      
      if (communityRatingPercentage !== undefined) {
        $(`.rating-function.logged-out i:nth-child(${starSelector})`).next().append(
          `<i class="fas fa-star filled" style="width:${communityRatingPercentage}"></i>`
        );
      }
    } else {
      $(".rating").text("(" + numberOfVotes + " reviews)");
    }
  });

  // display user rating when logged in
  $.getJSON(`/movie/userrating/${movie_id}`).then((data) => {
    userRating = data.rating_value

    if (data !== null) {
      $(`.rating-function.logged-in a:nth-child(${userRating})`).prevAll().addBack().find("i").append(
        `<i class="fas fa-star filled"></i>`
      );
      $(`.rating-function.logged-in a:nth-child(${userRating})`).nextAll().find("i").empty()
    }
  })
}

// Prevent search form from submitting if search input is empty
$('.search-bar').submit((e) => {
  if ($('#search-input').val() === '') {
   e.preventDefault();
  }
 });
