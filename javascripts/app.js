$.domReady(function(){
  function clickButton(label) {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'button',
      'eventAction': 'click',
      'eventLabel': label
    });
  };

  function clickEmailSubscribeInPostFooter() {
    return clickButton('subscribe-from-post-footer');
  };

  function clickConvertKitModal() {
    return clickButton('subscribe-modal-open');
  };

  function clickEmailSubscribeInSidebar() {
    return clickButton('subscribe-from-sidebar');
  };

  $('*[role=article] #ck_subscribe_button').on('click', clickEmailSubscribeInPostFooter);
  $('a[rel=ck_modal]').on('click', clickConvertKitModal);
  $('.sidebar #ck_subscribe_button').on('click', clickEmailSubscribeInSidebar);
});
