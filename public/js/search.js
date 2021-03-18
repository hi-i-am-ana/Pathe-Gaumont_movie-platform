// This script - is shared code for home and movie page: function for displaying list of movies; search filters; search dropdown

// Declare function to display (append) passed movie
const displayMovie = movie => {
  let posterUrl = '';
  if (movie.poster_path === null) {
    // TODO: Change placeholder image
    posterUrl = 'https://loremflickr.com/185/278';
  } else {
    posterUrl = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
  };
  movieContent = `
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
  $.getJSON(`/ratings/${movie.id}`)
  .then(data => {
    if (data.numberOfVotes !== 0) {
      $(`#rating-${movie.id}`).text(data.communityRating);
      $(`#number-of-votes-${movie.id}`).text(` (${data.numberOfVotes})`);
      $(`#rating-star-${movie.id}`).attr('style', 'color:orange');
    };
  })
  .catch(err => {
    // display error
  });
  $('.movies').append(movieContent);
};

// Declare funcion to create an array of API requests to be passed to Promise.all()
const formApiRequestBunch = (pageNumber, encodedSearchValue, totalPages, apiRequestBunchSize) => {
  let apiRequestBunch = [];
  for (i = 1; i <= apiRequestBunchSize; i++) {
    if (pageNumber + i <= totalPages) {
      const apiRequest = $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber + i}`);
      apiRequestBunch.push(apiRequest);
    };
  };
  return apiRequestBunch;
};

// Declare function to make a bunch of API requests and filter their responses
const filterApiResponse = (filteredResults, pageNumber, encodedSearchValue, checkedGenres, totalPages, displayNumber, apiRequestBunchSize) => {
  Promise.all(formApiRequestBunch(pageNumber, encodedSearchValue, totalPages, apiRequestBunchSize))
  .then(arrayOfdata => {
    console.log(arrayOfdata);
    $.each(arrayOfdata, (i, data) => {
      $.each(data.results, (i, movie) => {
        if (checkedGenres.length === 0) {
          filteredResults.push(movie);
          // This will limit number of movies displayed on page
          if (filteredResults.length <= displayNumber) {
            displayMovie(movie);
          };
        } else {
          const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(genre));
          if (isOfCheckedGenres) {
            filteredResults.push(movie);
            // This will limit number of movies displayed on page
            if (filteredResults.length <= displayNumber) {
              displayMovie(movie);
            };
          };
        };
      });
    });
    pageNumber += apiRequestBunchSize;
    console.log(filteredResults);
    console.log(`filtered result array length: ${filteredResults.length}`);
    console.log(`page number: ${pageNumber}`);
    console.log(`total pages: ${totalPages}`);
    if (filteredResults.length < displayNumber && pageNumber < totalPages) {
      filterApiResponse(filteredResults, pageNumber, encodedSearchValue, checkedGenres, totalPages, displayNumber, apiRequestBunchSize);
    } else {
      if (filteredResults.length === 0) {
        $('.movies').html('<p>There are no movies that matched your query</p>');
      };
    };
  })
  .catch(err => {
    // display error
  });
};

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
        <input class="search-genre-filter" type="checkbox" id="search-genre-${genre.id}" name="genre" value="${genre.id}">
        <label for="search-genre-${genre.id}">${genre.name}</label>
      </div>
      `).appendTo('.search-filters-half1');
    } else {
      $(`
      <div class="search-genre-filter-container">
        <input class="search-genre-filter" type="checkbox" id="search-genre-${genre.id}" name="genre" value="${genre.id}">
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
$('#search-input').blur((e) => {
  $(window).click((e) => {
    if(e.target !== $('.search-dropdown')) {
      $('.search-dropdown').hide();
      $('.search-bar').removeClass('searching');
    };
  });
});

// TODO: Do we need this?
// Add onscroll event listener for document to hide search dropdown when document is scrolled
// $(window).scroll(() => {
//   $('.search-dropdown').hide();
//   $('.search-bar').removeClass('searching');
// });

// If it's search without filtering genres, perform movie search for every change in search value (everything is sorted by their match relevancy boosted by popularity)
$('#search-input').on('input', () => {
  const advancedSearchStatus = $('.search-filters-container').css('display');
  if (advancedSearchStatus === 'none') {
    const searchValue = $('#search-input').val();
    if (searchValue === '') {
      $('.search-dropdown').hide();
      $('.search-bar').removeClass('searching');
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
          $('.search-bar').removeClass('searching');
        } else {
          $('.search-dropdown').show();
          $('.search-dropdown').html(searchDropdownContent);
          $('.search-bar').addClass('searching');
        };
      })
      .catch(err => {
        // display error
      });
    };
  };
});