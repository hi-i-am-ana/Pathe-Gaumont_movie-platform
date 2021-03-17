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
const filteredResults = [];
// let pageNumber = 1;
// let totalPages;
// while (filteredResults.length < 20) {
for (pageNumber = 1; pageNumber <= 10; pageNumber++) {
  // console.log(`length: ${filteredResults.length}`)
  $.getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodedSearchValue}&include_adult=false&page=${pageNumber}`)
  .then(data => {
    console.log(data);
    // totalPages = data.total_pages;
    $.each(data.results, (i, movie) => {
      if (checkedGenres.length === 0) {
        filteredResults.push(movie);
      } else {
        const isOfCheckedGenres =  checkedGenres.some(genre => movie.genre_ids.includes(+genre));
        if (isOfCheckedGenres) {
          filteredResults.push(movie);
        };
      };
    });
  })
  .catch(err => {
    // display error
  });
  // pageNumber++;
  // if (pageNumber > totalPages) {
  //   break;
  // };
};
// console.log(filteredResults);
$('.search-dropdown').hide();
$('.search-filters-container').hide();
$('.search-genre-filter').prop( 'checked', false );
$('.search-bar').removeClass('searching');
$('.hero-section').hide();
$('.filters-container').hide();
$('.movies-section-header').text('Search Results');
// displayMovies(filteredResults);
setTimeout(displayMovies, 300, filteredResults);
setTimeout(console.log, 300, filteredResults);