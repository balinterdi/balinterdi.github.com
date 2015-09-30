// script for TOC

$( document ).ready(function() {
  var slideHeight = 220;
  $(".wrap-container").each(function() {
      var $this = $(this);
      var $wrap = $this.children(".wrap");
      var defHeight = $wrap.height();
      if (defHeight >= slideHeight) {
          var $readMore = $this.find(".read-more");
          $wrap.css("height", slideHeight + "px");
          $readMore.append("<a href='#'>Click to Read More</a>");
          $readMore.children("a").bind("click", function(event) {
              var curHeight = $wrap.height();
              if (curHeight <= slideHeight) {
                  $wrap.animate({
                      height: defHeight
                  }, "normal");
                  $(this).text("Close");
                  $wrap.children(".gradient").fadeOut();
              } else {
                  $wrap.animate({
                      height: slideHeight
                  }, "normal");
                  $(this).text("Click to Read More");
                  $wrap.children(".gradient").fadeIn();
              }
              return false;
          });
      }
  });
})











