(function($) {
   function clickedSubscribe(label) {
     ga('send', {
       'hitType': 'event',
       'eventCategory': 'button',
       'eventAction': 'click',
       'eventLabel': label
     });
   }

  $(function() {
    $('#top-signup-form *[type=submit]').click(function() {
      clickedSubscribe('signup-top');
    });
    $('#bottom-signup-form *[type=submit]').click(function() {
      clickedSubscribe('signup-bottom');
    });
    $('.signup-form *[type=submit]').click(function() {
      clickedSubscribe('signup');
    });
  });
}(jQuery));
