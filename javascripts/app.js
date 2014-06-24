$.domReady(function(){
  var clickEmailSubscribe = function() {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'link',
      'eventAction': 'click',
      'eventLabel': 'post-footer-email-optin'
    });
  };

  $('#post-email-optin').on('click', clickEmailSubscribe);
});
