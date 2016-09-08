(function($) {
   function clickedButton(label, value) {
     ga('send', {
       'hitType': 'event',
       'eventCategory': 'button',
       'eventAction': 'click',
       'eventLabel': label,
       'eventValue': value
     });
   }

  $(function() {
    $('#ck_subscribe_button').click(function() {
      clickedButton('signup');
    });

    $('.buy-button').click(function(event) {
      var button$ = $(event.target);
      if (!button$.hasClass('buy-button')) {
        button$ = button$.parent();
      }
      var price = button$.attr('data-price');
      if (price) {
        price = parseInt(price, 10);
      }
      clickedButton('buy', price);
    });
  });

  // Fire an event so that GA doesn't count it as a "bounce"
  // http://blog.popcornmetrics.com/why-your-google-analytics-bounce-rate-is-wrong-and-how-to-fix-it/
  function readPage() {
     ga('send', {
       'hitType': 'event',
       'eventCategory': 'engagement',
       'eventAction': 'read'
     });
  }

  var readPageTime = 20 * 1000;
  setTimeout(readPage, readPageTime);

}(jQuery));
