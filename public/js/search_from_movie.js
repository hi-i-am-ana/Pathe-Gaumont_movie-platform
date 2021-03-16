// This script - is for performing search from movie page
// Perform movie search for passed search value (and filters), then display list of found and filtered movies

// TODO: Check if this array is empty
const checkedGenres = genres.split(',');
const encodedSearchValue = encodeURIComponent(searchValue);

const filteredResults = [];
let pageNumber = 1;
// while (filteredResults.length < 20) {
  $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber}`)
  .then(data => {
    $.each(data.results, (i, movie) => {
      const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(+genre));
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
