(function($) {
  $('.book-cover-link').click(function() {
    window.mixpanel.track('Clicked book in sidebar');
  });
}(jQuery));
