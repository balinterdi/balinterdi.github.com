var dp = jQuery;
dp.noConflict();
dp(document).ready(function() {
    //FIT VIDS
    dp(".video-review").fitVids();
    //CHAPTER CAROUSEL
    dp(".carouselchapter").carousel('pause');
    //NIVO LIGHTBOX
    dp("a[data-call='nivo-slider']").nivoLightbox();
    //TOOL TIP
    dp('a[data-toggle="tooltip"]').tooltip();
    //ROTATES TEXT
    dp(".rotatez").textrotator({
        animation: "fade",
        speed: 1600
    });
    //QUOTE SLIDE
    if (dp.fn.sudoSlider) {
        dp("#quote-slider").sudoSlider({
            customLink: 'a.quoteLink',
            speed: 425,
            prevNext: true,
            responsive: true,
            prevHtml: '<a href="#" class="quote-left-indicator"><i class="icon-arrow-left"></i></a>',
            nextHtml: '<a href="#" class="quote-right-indicator"><i class="icon-arrow-right"></i></a>',
            useCSS: true,
            continuous: true,
            effect: "fadeOutIn",
            updateBefore: true
        });
    }
});
