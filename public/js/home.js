// TODO: .catch() - display errors

// HERO MOVIE

// Get hero movie - random movie from the first 20 now playing movies
$.getJSON(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&page=1`)
.then(data => {
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const heroMovie = data.results[randomIndex];
  $('.hero-title').text(heroMovie.title);
  $('.hero-overview').text(heroMovie.overview);
  $('.hero-release_date').text(heroMovie.release_date);
  return heroMovie.id;
})
.then(heroMovieId => {
  // Then first: get hero movie additional details (genre names and runtime)
  $.getJSON(`https://api.themoviedb.org/3/movie/${heroMovieId}?api_key=${api_key}`)
  .then(data => {
    const heroGenres = [];
    $.each(data.genres, (i, genre) => {
      heroGenres.push(genre.name);
    });
    $('.hero-runtime-genres-release').text(`${data.runtime} min\u00A0\u00A0|\u00A0\u00A0${heroGenres.join(', ')}\u00A0\u00A0|\u00A0\u00A0${data.release_date}`);
  })
  .catch(err => {
    // display error
  });
  // Second: get hero movie cast (3 most popular) and their profile pictures
  $.getJSON(`https://api.themoviedb.org/3/movie/${heroMovieId}/credits?api_key=${api_key}`)
  .then(data => {
    data.cast.sort((a, b) => b.popularity - a.popularity);
    const heroActors = [data.cast[0], data.cast[1], data.cast[2]];
    $.each(heroActors, (i, actor) => {
      $.getJSON(`https://api.themoviedb.org/3/person/${actor.id}/images?api_key=${api_key}`)
      .then(data => {
        const actorImageUrl = `https://image.tmdb.org/t/p/w45${data.profiles[0].file_path}`;
        return actorImageUrl;
      })
      .then(actorImageUrl => {
        $(`#hero-actor${i}-image`).attr('src', actorImageUrl);
        $(`#hero-actor${i}-name`).text(actor.name)
      })
      .catch(err => {
        // display error
      });
    });
  })
  .catch(err => {
    // display error
  });
  // Third: get hero movie video - filter trailers only and choose random trailer
  $.getJSON(`https://api.themoviedb.org/3/movie/${heroMovieId}/videos?api_key=${api_key}`)
  .then((data) => {
    const filteredResults = data.results.filter(video => video.type === 'Trailer' & (video.site === 'YouTube' || video.site === 'Vimeo'));
    const randomIndex = Math.floor(Math.random() * filteredResults.length);
    const heroVideo = filteredResults[randomIndex];
    // TODO: Add condition for case of other sites
    if (heroVideo.site === 'YouTube') {
      heroVideoUrl = `https://www.youtube.com/embed/${heroVideo.key}`;
    } else if (heroVideo.site === 'Vimeo') {
      heroVideoUrl = `https://vimeo.com/${heroVideo.key}`;
    };
    $('.hero-video').attr('src', heroVideoUrl);
  })
  .catch(err => {
    // display error
  });
  // And fourth: get hero movie rating
  $.getJSON(`/ratings/${heroMovieId}`)
      .then(data => {
        if (data.numberOfVotes !== 0) {
          $(`.hero-rating-value`).text(`\u00A0${data.communityRating}`);
          $(`.hero-number-of-votes`).text(`(${data.numberOfVotes})`);
          $(`#hero-rating-star`).attr('style', 'color:orange');
        };
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
let jsonQueryPopular = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&`
$.getJSON(jsonQueryPopular + 'page=1')
.then(data => {
  $('.movies-section-header').text(`What's Popular`);
  displayMovies(data.results);
  displayPagination(data, jsonQueryPopular);
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
    let jsonQueryPopFilter = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}${checkedGenres}&sort_by=popularity.desc&include_adult=false&include_video=false&`
    $.getJSON(jsonQueryPopFilter + 'page=1')
    .then(data => {
      displayMovies(data.results);
      displayPagination(data, jsonQueryPopFilter)
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
  let jsonQueryPopClear = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&`
  $.getJSON(jsonQueryPopClear + 'page=1')
  .then(data => {
    displayMovies(data.results);
    displayPagination(data, jsonQueryPopClear)
  })
  .catch(err => {
    // display error
  });
});

// SEARCH

// Prevent search form from submitting
$('.search-bar').submit((e) => {
  e.preventDefault();
});

// Perform movie search (with or without filters) for final search value, then display list of found and filtered movies
// Variant 3. Function with bunch of API request (Promise.all) is called from itself (from .then)
$('.searchBtn').click(() => {
  const searchValue = $('#search-input').val();
  if (searchValue !== '') {
    // Create array of filtered genres
    let checkedGenres = [];
    $('.search-genre-filter:checked').each((i, genre) => {
      const checkedGenre = genre.value;
      checkedGenres.push(+checkedGenre);
    });
    const encodedSearchValue = encodeURIComponent(searchValue);
    // Make API request to get total number of pages
    let jsonQuerySearch = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&`
    $.getJSON(jsonQuerySearch + 'page=1')
    .then(data => {
      $('.search-dropdown').hide();
      $('.search-filters-container').hide();
      $('.search-genre-filter').prop( 'checked', false );
      $('.search-bar').removeClass('searching');
      $('.hero-section').hide();
      $('.filters-container').hide();
      $('.movies-section-header').text('Search Results');
      $('.movies').empty();
      const totalPages = data.total_pages;
      // This can be just number that is incremented, but left it as an array in case I need it for pagination
      const filteredResults = [];
      const displayNumber = 20;
      const apiRequestBunchSize = 10;
      filterApiResponse(filteredResults, 0, encodedSearchValue, checkedGenres, totalPages, displayNumber, apiRequestBunchSize);
      displayPagination(data, jsonQuerySearch);
    })
    .catch(err => {
      // display error
    });
  };
});

// Variant 1: Uses "for" loop, API request are made acynchronously => works well and fast, but can't break from loop when condition of 20 filtered movies is met => will continue to make API requests until all pages have been requested
// $('.searchBtn').click(() => {
//   const searchValue = $('#search-input').val();
//   if (searchValue !== '') {
//     // Create array of filtered genres
//     let checkedGenres = [];
//     $('.search-genre-filter:checked').each((i, genre) => {
//       const checkedGenre = genre.value;
//       checkedGenres.push(+checkedGenre);
//     });
//     const encodedSearchValue = encodeURIComponent(searchValue);
//     const filteredResults = [];
//     // Make API request to get total number of pages
//     $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
//     .then(data => {
//       $('.search-dropdown').hide();
//       $('.search-filters-container').hide();
//       $('.search-genre-filter').prop( 'checked', false );
//       $('.search-bar').removeClass('searching');
//       $('.hero-section').hide();
//       $('.filters-container').hide();
//       $('.movies-section-header').text('Search Results');
//       $('.movies').empty();
//       const totalPages = data.total_pages;
//       for (pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
//         $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber}`)
//         .then(data => {
//           console.log(data);
//           $.each(data.results, (i, movie) => {
//             // TODO: This if will limit filtered result to 20 movies. How to break loop with async stuff, so API requests are not made after 20 movies are filtered
//             if (filteredResults.length < 20) {
//               if (checkedGenres.length === 0) {
//                 filteredResults.push(movie);
//                 displayMovie(movie);
//                 console.log(movie)
//               } else {
//                 const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(genre));
//                 if (isOfCheckedGenres) {
//                   filteredResults.push(movie);
//                   displayMovie(movie);
//                 };
//               };
//             };
//           });
//           console.log(filteredResults);
//         })
//         .catch(err => {
//           // display error
//         });
//       };
//     })
//     .catch(err => {
//       // display error
//     });
//   };
// });

// // Variant 2. Function with API request is called from itself (from .then) => can be stopped when condition of 20 filtered movies is met, works well, but API requests made one by one => can be slow if search value & filters are very narrowed
// $('.searchBtn').click(() => {
//   const searchValue = $('#search-input').val();
//   if (searchValue !== '') {
//     // Create array of filtered genres
//     let checkedGenres = [];
//     $('.search-genre-filter:checked').each((i, genre) => {
//       const checkedGenre = genre.value;
//       checkedGenres.push(+checkedGenre);
//     });
//     const encodedSearchValue = encodeURIComponent(searchValue);
//     const filteredResults = [];
//     // Make API request to get total number of pages
//     $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
//     .then(data => {
//       const totalPages = data.total_pages;
//       $('.search-dropdown').hide();
//       $('.search-filters-container').hide();
//       $('.search-genre-filter').prop( 'checked', false );
//       $('.search-bar').removeClass('searching');
//       $('.hero-section').hide();
//       $('.filters-container').hide();
//       $('.movies-section-header').text('Search Results');
//       $('.movies').empty();
//       filterApiResponse(filteredResults, 1, encodedSearchValue, checkedGenres, totalPages);
//     })
//     .catch(err => {
//       // display error
//     });
//   };
// });

// const filterApiResponse = (filteredResults, pageNumber, encodedSearchValue, checkedGenres, totalPages) => {
//   $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber}`)
//   .then(data => {
//     console.log(data);
//     $.each(data.results, (i, movie) => {
//       if (checkedGenres.length === 0) {
//         filteredResults.push(movie);
//         displayMovie(movie);
//       } else {
//         const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(genre));
//         if (isOfCheckedGenres) {
//           filteredResults.push(movie);
//           displayMovie(movie);
//         };
//       };
//     });
//     pageNumber++;
//     console.log(filteredResults);
//     console.log(filteredResults.length)
//     console.log(pageNumber)
//     if (filteredResults.length < 20 && pageNumber <= totalPages) {
//       filterApiResponse(filteredResults, pageNumber, encodedSearchValue, checkedGenres, totalPages);
//     };
//   })
//   .catch(err => {
//     // display error
//   });
// };
