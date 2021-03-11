// TODO: .catch() - display errors
// TODO: Pagination
// TODO: Logic for searching from movie page??? search button onclick -> get request with special URL -> in get route redirect (render? - url will be misleading) home page but passing some query parameter -> in home get route pass this parameter to template -> using this parameter in script
// TODO: Local filters for search results
// TODO: Display hero movie details
// TODO: Media queries
// TODO: Put search bar dropdown logic in a separate file - will be used on both pages
// TODO: Put search bar/dropdown CSS in Amelia's file

// Declare function to display list of movies from received data
const displayMovies = (data) => {
  console.log(data);
  let moviesContent = '';
  if (data.results.length === 0) {
    moviesContent = '<p>There are no movies that matched your query</p>';
  } else {
    $.each(data.results, (i, movie) => {
      let posterUrl = '';
      if (movie.poster_path === null) {
        // TODO: Change placeholder image
        posterUrl = 'https://loremflickr.com/185/278';
      } else {
        posterUrl = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`;
      };
      moviesContent += `
        <div class="movie" id="movie-${movie.id}">
          <a href="/movie/${movie.id}"><img src="${posterUrl}" alt="${movie.title}"></a>
          <h4>${movie.title}</h4>
          <div class="rating-container">
            <i class="fas fa-star rating-star" id="rating-star-${movie.id}"></i>
            <div class="rating">
              <span class="rating-value" id="rating-${movie.id}"></span>
              <span class="number-of-votes" id="number-of-votes-${movie.id}"></span>
            </div>
          </div>
        </div>
      `;
      // TODO: Try put ID as parameter
      // TODO: Research fetch API and axios
      $.getJSON(`/${movie.id}`)
      .then(data => {
        if (data.numberOfVotes !== 0) {
          $(`#rating-${movie.id}`).text(`${data.communityRating}/`);
          $(`#number-of-votes-${movie.id}`).text(data.numberOfVotes);
          $(`#rating-star-${movie.id}`).attr('style', 'color:orange');
        };
      });
    });
  };
  $('.movies').html(moviesContent);
};

// Get now-playing movie for hero
$.getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=1`)
.then(data => {
  console.log(data);
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const heroMovie = data.results[randomIndex];
  console.log(heroMovie);
  return heroMovie;
})
.then(heroMovie => {
  $.getJSON(`https://api.themoviedb.org/3/movie/${heroMovie.id}/videos?api_key=${api_key}`)
  .then((data) => {
    console.log(data);
    const filteredResults = data.results.filter(video => video.type === 'Trailer' & (video.site === 'YouTube' || video.site === 'Vimeo'));
    const randomIndex = Math.floor(Math.random() * filteredResults.length);
    const heroVideo = filteredResults[randomIndex];
    console.log(heroVideo);
    // TODO: Add condition for case of other sites
    let heroVideoURL = '';
    if (heroVideo.site === 'YouTube') {
      heroVideoURL = `https://www.youtube.com/embed/${heroVideo.key}`;
    } else if (heroVideo.site === 'Vimeo') {
      heroVideoURL = `https://vimeo.com/${heroVideo.key}`;
    };
    $('.hero-video').attr('src', heroVideoURL);
  })
  .catch(err => {
    // display error
  }); 
})
.catch(err => {
  // display error
});

// Get list of movies sorted by popularity (desc), then display list
$.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
.then(data => {
  $('.movies-section-header').text(`What's Populal`);
  displayMovies(data);
})
.catch(err => {
  // display error
});

// in case search dropdown has borders
$('.search-dropdown').hide();

// Perform movie search for every change in search value (everything is sorted by their match relevancy boosted by popularity)
$('#search-input').on('input', () => {
  const searchValue = $('#search-input').val();
  if (searchValue === '') {
    // $('.search-dropdown').html('');
    $('.search-dropdown').hide();
  } else {
    const encodedSearchValue = encodeURIComponent(searchValue);
    $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
    .then(data => {
      // Fill search dropdown with the list of found movies
      let searchDropdownContent = '';
      $.each(data.results, (i, movie) => {
        let posterURL = '';
        if (movie.poster_path !== null) {
          posterURL = `https://image.tmdb.org/t/p/w92/${movie.poster_path}`;
        };
        const releaseYear = movie.release_date.substring(0,4);
        searchDropdownContent += `
          <a class="search-item" href="/movie/${movie.id}">
            <div class="search-item-container" >
              <img class="search-item-poster" src=${posterURL}>
              <div class="search-item-details">
                <div class="search-item-title">${movie.title}</div>
                <div class="search-item-year">${releaseYear}</div>
              </div>
            </div>
          </a>
        `;
      });
      console.log(searchDropdownContent)
      if (searchDropdownContent === '') {
        $('.search-dropdown').hide();
      } else {
        $('.search-dropdown').show();
        $('.search-dropdown').html(searchDropdownContent);
      };
    })
    .catch(err => {
      // display error
    });
  };
});

// Clear search dropdown when search input loses focus
$('#search-input').blur(() => {
  // $('.search-dropdown').html('');
  $('.search-dropdown').hide();
});

// Clear search dropdown when window is scrolled
$(window).scroll(() => {
  // $('.search-dropdown').html('');
  $('.search-dropdown').hide();
});

// Perform movie search for final search value, then display list of found movies
$('.searchBtn').click(() => {
  const searchValue = $('#search-input').val();
  const encodedSearchValue = encodeURIComponent(searchValue);
  $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
  .then(data => {
    $('.hero-section').hide();
    $('.filters-container').hide();
    $('.movies-section-header').text('Search Results');
    displayMovies(data);
  })
  .catch(err => {
    // display error
  });
});

// Get list of existing genres, then display them as checkboxes
$.getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
.then(data => {
  console.log(data.genres);
  $.each(data.genres, (i, genre) => {
    $(`
      <div class="genre-filter-container">
        <input class="genre-filter" type="checkbox" id="genre-${genre.id}" name="genre" value="${genre.id}">
        <label for="genre-${genre.id}">${genre.name}</label>
      </div>  
      `).appendTo('.filters-container');
  });
})
// Then add onchange event listeners for checkboxes to get list of filtered movies and to display them
.then(() => {
  $('.genre-filter').change(() => {
    let checkedGenres = '';
    $('.genre-filter:checked').each((i, genre) => {
      const checkedGenre = genre.value;
      checkedGenres += `&with_genres=${checkedGenre}`;
    });
    $.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}${checkedGenres}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
    .then(data => {
      displayMovies(data);
    })
    .catch(err => {
      // display error
    });
  });
})
.catch(err => {
  // display error
});

// Then add onclick event listener for "clear all" button to clear all filters
$('.clear-filters').click(() => {
  // Code below works, it progammatically clicks all checked checkboxes and trigger change event, but API responses are coming in unexpected order, so the last response can be with filtered genre/genres and this data will be displayed on page
  // $('.genre-filter').each((i, checkbox) =>  {
  //   if (checkbox.checked) {
  //     checkbox.click();
  //   };
  // });
  // Code below will just change checkbox state, but will not trigger change event, so we make API request without genres:
  $('.genre-filter').prop( 'checked', false );
  $.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
  .then(data => {
    displayMovies(data);
  })
  .catch(err => {
    // display error
  });
});

// This is just test function for testing API requests:
// $.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=28&with_genres=12&include_adult=false&page=1`)
// .then(data => {
//   console.log(data);
// });
