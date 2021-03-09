const displayMovies = (data) => {
  console.log(data);
  let moviesContent = '';
  if (data.results.length === 0) {
    moviesContent = '<p>There are no movies that matched your query</p>';
  } else {
    $.each(data.results, (i, movie) => {
      let posterUrl = '';
      if (movie.poster_path === null) {
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

$.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
.then(data => {
  $('.movies-section-header').text(`What's Populal`);
  displayMovies(data);
})
.catch(err => {
  // display error
})

$('#search').on('input', () => {
  const searchValue = $('#search').val();
  if (searchValue === '') {
    $('.search-dropdown').html('');
  } else {
    const encodedSearchValue = encodeURIComponent(searchValue);
    $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
    .then(data => {
      let searchDropdownContent = '';
      $.each(data.results, (i, movie) => {
        // let posterURL = '';
        // if (movie.poster_path !== null) {
        //   posterURL = `https://image.tmdb.org/t/p/w92/${movie.poster_path}`;
        // };
        searchDropdownContent += `
          <a class="search-item" id="search-item-${movie.id}" href="/movie/${movie.id}">${movie.title}</a>
        `;
      });
      $('.search-dropdown').html(searchDropdownContent);
    })
    .catch(err => {
      // display error
    });
  };
});

$('#search').blur(() => {
  $('.search-dropdown').html('');
});

$('.search-button').click(() => {
  const searchValue = $('#search').val();
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
.then(() => {
  $('.genre-filter').change(() => {
    let checkedGenres = '';
    $('.genre-filter:checked').each((i, genre) => {
      const checkedGenre = genre.value;
      checkedGenres += `&with_genres=${checkedGenre}`;
    });
    // $.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}${checkedGenres}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`)
    // .then(data => {
    //   displayMovies(data);
    // })
    // .catch(err => {
    //   // display error
    // });
    $.getJSON(`https://api.themoviedb.org/3/discover/movie?api_key=${api_key}${checkedGenres}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`, (data) => {
      displayMovies(data);
    })
  });
})
.catch(err => {
  // display error
});

$('.clear-filters').click(() => {
  $('.genre-filter').each((i, checkbox) =>  {
    if (checkbox.checked) {
      checkbox.click();
    };
  });
});