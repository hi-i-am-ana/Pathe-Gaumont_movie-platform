const displayPagination = (data, jsonQuery) => {
    if (data.total_pages > 0) {
        let paginationButtons = ''
        let lastPage = data.total_pages
        if (lastPage > 50) lastPage = 50 // hard limit number of pages
        let currentPage = data.page
        const pageRange = 2
        let rangeStart = currentPage - pageRange
        let rangeEnd = currentPage + pageRange
        
        // limit pages viewable to only those in range
        if (rangeStart < 1) rangeStart = 1
        if (rangeEnd > lastPage ) rangeEnd = lastPage

        if (rangeStart <= 2 && rangeEnd >= (lastPage - 1)) {
            // display all numbers
            for (i = 1; i <= lastPage; i++ ) {
                paginationButtons += `<div class="page-${i}">${i}</div>`
            }
        } else {
            // if rangeStart !== 1, add first page
            if (rangeStart !== 1) {
                paginationButtons += `<div class="page-1">1</div>`
            }
            // if rangeStart - 1 > 1, add elipsis
            if ((rangeStart - 1) > 1) {
                paginationButtons += `<div>...</div>`
            }
            // loop through buttons from rangeStart to rangeEnd
            for (i = rangeStart; i <= rangeEnd; i++ ) {
                paginationButtons += `<div class="page-${i}">${i}</div>`
            }
            // if lastPage - rangeEnd > 1, add elipsis
            if ((lastPage - rangeEnd) > 1) {
                paginationButtons += `<div>...</div>`
            }
            // if rangeEnd !== lastPage, add last page
            if (rangeEnd !== lastPage) {
                paginationButtons += `<div class="page-${lastPage}">${lastPage}</div>`
            }
            
        }
        $('.pagination').html(paginationButtons);

        // attach "current" class to currentPage
        $('.pagination').find(`div.page-${currentPage}`).addClass('current')

        $('.pagination div').click(function (e) {
            let clickedPageClass = $(this).attr("class")
            let clickedPageNumber = Number(clickedPageClass.slice(5))

            $.getJSON(jsonQuery + `page=${clickedPageNumber}`)
            .then(newdata => {
                displayMovies(newdata.results);
                displayPagination(newdata, jsonQuery);
            })
            .catch(err => {
            // display error
            }); 
        });
    }


}

