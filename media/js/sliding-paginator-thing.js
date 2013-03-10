$(document).ready(function(){
    // My very first piece of JS code ever.
    var NUM_PAGES = 2;

    // Show the first page, hide the rest
    var i = 0;
    for (i = 0; i <= NUM_PAGES; i++){
        $('div.sliding-index-page' + i).hide();
    }

    var currentPage = 0;
    $('div.sliding-index-page' + currentPage).show();
    $("#sliding-prev-page").attr('disabled', true);
    $("#sliding-next-page").attr('disabled', false);

    // Previous page.
    $('#sliding-prev-page').on('click touchstart', function() {
        $("#sliding-next-page").attr('disabled', false);
        if (currentPage !== 0) {
            $('div.sliding-index-page' + currentPage).fadeOut();
            currentPage--;
            if (currentPage === 0) {
                $("#sliding-prev-page").attr('disabled', true);
            }
            $('div.sliding-index-page' + currentPage).fadeIn();
        }
    });

    // Next page.
    $('#sliding-next-page').on('click touchstart', function() {
        $("#sliding-prev-page").attr('disabled', false);
        if (currentPage != NUM_PAGES - 1){
            $('div.sliding-index-page' + currentPage).fadeOut();
            currentPage++;
            if (currentPage == NUM_PAGES - 1) {
                $("#sliding-next-page").attr('disabled', true);
            }
            $('div.sliding-index-page' + currentPage).fadeIn();
        }
    });
});
