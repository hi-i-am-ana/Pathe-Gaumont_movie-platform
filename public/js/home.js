// TODO: .catch() - display errors
// TODO: Pagination
// TODO: Logic for searching from movie page??? search button onclick -> get request with special URL -> in get route redirect (render? - url will be misleading) home page but passing some query parameter -> in home get route pass this parameter to template -> using this parameter in script
// TODO: Media queries
// TODO: Put all search logic in a separate file - will be used on both pages
// TODO: Put all search CSS in Amelia's file - will be used on both pages

// TODO: Run search by clicking enter button
// TODO: Local filters for search results
// TODO: Display hero movie details

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
      // TODO: How else can I pass id?
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

// HERO MOVIE

// Get movie for hero - random movie from the first 20 now playing movies
$.getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=1`)
.then(data => {
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const heroMovie = data.results[randomIndex];
  console.log(heroMovie);
  return heroMovie;
})
// Then get videos for hero movie, filter trailers and display random trailer
.then(heroMovie => {
  $.getJSON(`https://api.themoviedb.org/3/movie/${heroMovie.id}/videos?api_key=${api_key}`)
  .then((data) => {
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

// POPULAR MOVIES

// Get list of movies sorted by popularity (desc), then display list
$.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
.then(data => {
  $('.movies-section-header').text(`What's Populal`);
  displayMovies(data);
})
.catch(err => {
  // display error
});

// FILTERS FOR POPULAR MOVIES

// Get list of existing genres, then display them as checkboxes
$.getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
.then(data => {
  $.each(data.genres, (i, genre) => {
    $(`
      <div class="genre-filter-container">
        <input class="genre-filter" type="checkbox" id="genre-${genre.id}" name="" value="${genre.id}">
        <label for="genre-${genre.id}">${genre.name}</label>
      </div>
      `).appendTo('.filters-container');
  });
})
// Then add onchange event listeners for checkboxes to get list of filtered movies and to display them
// TODO: Check if I can put this separately, without .then will be value of undefined?
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

// Add onclick event listener for "clear all" button to clear all filters
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

// SEARCH
// TODO: Put this code into a separate file as it will be user for both pages

// FILTERS FOR SEARCH

$('.search-filters-container').hide();

// Add onclick event listener for "filter by genre" button to clear all filters and open/close window with filters
$('.advanced-search-button').click(() => {
  $('.search-filters-container').toggle();
  $('.search-genre-filter').prop( 'checked', false );
});

// Add onclick event listener for "clear all" button to clear all filters
$('.search-clear-filters').click(() => {
  $('.search-genre-filter').prop( 'checked', false );
});

// Add onclick event listener for "close filter by genre" button
$('.close-advanced-search-button').click(() => {
  $('.search-filters-container').hide();
  $('.search-genre-filter').prop( 'checked', false );
});

// Get list of existing genres, then display them as checkboxes
$.getJSON(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`)
.then(data => {
  const halfLength = data.genres.length/2
  $.each(data.genres, (i, genre) => {
    if (i <= halfLength) {
      $(`
      <div class="search-genre-filter-container">
        <input class="search-genre-filter" type="checkbox" id="search-genre-${genre.id}" name="" value="${genre.id}">
        <label for="search-genre-${genre.id}">${genre.name}</label>
      </div>
      `).appendTo('.search-filters-half1');
    } else {
      $(`
      <div class="search-genre-filter-container">
        <input class="search-genre-filter" type="checkbox" id="search-genre-${genre.id}" name="" value="${genre.id}">
        <label for="search-genre-${genre.id}">${genre.name}</label>
      </div>
      `).appendTo('.search-filters-half2');
    };
  });
})
.catch(err => {
  // display error
});

// SEARCH DROPDOWN

$('.search-dropdown').hide();

// Add onblur event listener for search input to hide search dropdown when search input loses focus
$('#search-input').blur(() => {
  $('.search-dropdown').hide();
});

// TODO: Do we need this?
// Add onscroll event listener for document to hide search dropdown when document is scrolled
// $(window).scroll(() => {
//   $('.search-dropdown').hide();
// });

// If it's search without filtering genres, perform movie search for every change in search value (everything is sorted by their match relevancy boosted by popularity)
$('#search-input').on('input', () => {
  const advancedSearchStatus = $('.search-filters-container').css('display');
  if (advancedSearchStatus === 'none') {
    const searchValue = $('#search-input').val();
    if (searchValue === '') {
      $('.search-dropdown').hide();
    } else {
      const encodedSearchValue = encodeURIComponent(searchValue);
      $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
      .then(data => {
        // Fill search dropdown with the list of found movies
        let searchDropdownContent = '';
        $.each(data.results, (i, movie) => {
          let posterURL = 'https://loremflickr.com/92/138';
          if (movie.poster_path !== null) {
            posterURL = `https://image.tmdb.org/t/p/w92/${movie.poster_path}`;
          };
          const releaseYear = movie.release_date.substring(0,4);
          searchDropdownContent += `
            <a class="search-item" href="/movie/${movie.id}">
              <div class="search-item-container">
                <img class="search-item-image" src=${posterURL}>
                <div class="search-item-details">
                  <div class="search-item-title">${movie.title}</div>
                  <div class="search-item-year">${releaseYear}</div>
                </div>
              </div>
            </a>
          `;
        });
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
  };
});

// Perform movie search (with or without filters) for final search value, then display list of found movies
$('.searchBtn').click(() => {
  const searchValue = $('#search-input').val();
  if (searchValue !== '') {
    // Create array of filtered genres
    // TODO: Code for a case when this array is empty
    let checkedGenres = [];
    $('.search-genre-filter:checked').each((i, genre) => {
      const checkedGenre = genre.value;
      checkedGenres.push(+checkedGenre);
    });
    console.log(checkedGenres);
    const encodedSearchValue = encodeURIComponent(searchValue);
    const filteredResults = [];
    let pageNumber = 1;
    // while (filteredResults.length < 20) {
      console.log(`length: ${filteredResults.length}`)
      $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber}`)
      .then(data => {
        console.log(data);
        $.each(data.results, (i, movie) => {
          const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(genre));
          if (isOfCheckedGenres) {
            filteredResults.push(movie);
          };
        });
        pageNumber++
        // if (data.results.length < 20) {
        //   break;
        // };
        $('.hero-section').hide();
        $('.filters-container').hide();
        $('.movies-section-header').text('Search Results');
        displayMovies(data);
      })
      .catch(err => {
        // display error
      });
    // };
    console.log(filteredResults);
  };
});
