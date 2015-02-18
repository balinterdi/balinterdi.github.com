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
    $('#top-signup-form *[type=submit]').click(function() {
      clickedButton('signup-top');
    });
    $('#bottom-signup-form *[type=submit]').click(function() {
      clickedButton('signup-bottom');
    });
    $('.signup-form *[type=submit]').click(function() {
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
}(jQuery));
