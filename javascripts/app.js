$.domReady(function(){
  var clickEmailSubscribe = function() {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button',
      'eventAction': 'click',
      'eventLabel': 'post-footer-email-optin'
    });
  };

  $('#ck_subscribe_button').on('click', clickEmailSubscribe);
});
