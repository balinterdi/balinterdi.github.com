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
}(jQuery));
