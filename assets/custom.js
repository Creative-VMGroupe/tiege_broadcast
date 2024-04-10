/*
* Broadcast Theme
*
* Use this file to add custom Javascript to Broadcast.  Keeping your custom
* Javascript in this fill will make it easier to update Broadcast. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*/


(function() {
  // Hide Header on on scroll down
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('.header__wrapper').outerHeight();
    
    $(window).scroll(function(event){
        didScroll = true;
    });
    
    setInterval(function() {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);
    
    function hasScrolled() {
        var st = $(this).scrollTop();
        if(Math.abs(lastScrollTop - st) <= delta)
            return;
        if (st > lastScrollTop && st > navbarHeight){
            $('.header__wrapper').removeClass('js__header__stuck').addClass('aos-animate');
        } else {
            if(st + $(window).height() < $(document).height()) {
                $('.header__wrapper').addClass('js__header__stuck').removeClass('aos-animate');
            }
        }
        lastScrollTop = st;
    }
})();

document.addEventListener("theme:quick-add:open", function(event) {
  let openedModals = document.querySelectorAll('.product-quick-add');
  const currentModal = openedModals[openedModals.length - 1];
  const config = {
    productId: currentModal.dataset.productId, 
    injectionParent: 'form#product-form-upsell-api-product-upsell-'+currentModal.dataset.productId,
    injectionMethod: 'prepend'
  };
  if (currentModal.querySelectorAll('.rc-widget').length === 0) {
    window.ReChargeWidget.createWidget(config);
  }
});