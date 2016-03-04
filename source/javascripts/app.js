$.domReady(function(){
  function clickButton(label) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button',
      'eventAction': 'click',
      'eventLabel': label
    });
  };

  function clickConvertKitModal() {
    return clickButton('subscribe-modal-open');
  };

  function clickEmailSubscribeInPostFooter() {
    return clickButton('subscribe-from-post-footer');
  };

  function clickEmailSubscribeInSidebar() {
    return clickButton('subscribe-from-sidebar');
  };

  function clickEmailSubscribeInModal() {
    return clickButton('subscribe-from-modal');
  };

  $('a[rel=ck_modal]').on('click', clickConvertKitModal);

  $('*[role=article] .ck_subscribe_button').on('click', clickEmailSubscribeInPostFooter);
  $('.sidebar #ck_subscribe_button').on('click', clickEmailSubscribeInSidebar);
  $('.ck_modal .ck_subscribe_button').on('click', clickEmailSubscribeInModal);

  // Fire an event so that GA doesn't count it as a "bounce"
  // http://blog.popcornmetrics.com/why-your-google-analytics-bounce-rate-is-wrong-and-how-to-fix-it/
  function readPage() {
     ga('send', {
       'hitType': 'event',
       'eventCategory': 'engagement',
       'eventAction': 'read'
     });
  }

  var readPageTime = 60 * 1000;
  setTimeout(readPage, readPageTime);

});
