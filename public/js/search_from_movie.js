// This script - is for performing search from movie page
// Perform movie search for passed search value (and filters), then display list of found and filtered movies

$('#search-input').val(searchValue);
let checkedGenres;
if (genres === '') {
  checkedGenres = [];
} else {
  checkedGenres = genres.split(',');
};
const encodedSearchValue = encodeURIComponent(searchValue);

// Make API request to get total number of pages
$.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=1`)
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
})
.catch(err => {
  // display error
});
