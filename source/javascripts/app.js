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

});
