$.domReady(function(){
  function clickButton(label) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button',
      'eventAction': 'click',
      'eventLabel': label
    });
    return false;
  };

  function clickEmailSubscribeInPostFooter() {
    return clickButton('convertkit-subscribe-post-footer');
  };

  function clickConvertKitModal() {
    return clickButton('convertkit-modal-open');
  };

  function clickEmailSubscribeInSidebar() {
    return clickButton('convertkit-subscribe-sidebar');
  };

  $('*[role=article] #ck_subscribe_button').on('click', clickEmailSubscribeInPostFooter);
  $('a[rel=ck_modal]').on('click', clickConvertKitModal);
  $('.sidebar #ck_subscribe_button').on('click', clickEmailSubscribeInSidebar);
});
