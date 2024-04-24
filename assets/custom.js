/*
 * Broadcast Theme
 *
 * Use this file to add custom Javascript to Broadcast.  Keeping your custom
 * Javascript in this fill will make it easier to update Broadcast. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 */

(function () {
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $(".header__wrapper").outerHeight();

$(document).ready(function() {
    // Modify the opacity of the specified class to 1
  if(window.location.href.indexOf("products") > -1) 
    console.log(window.location.href.indexOf("products") > -1)
    
    $('body:has(.main-content > .shopify-section.section-overlay-header:first-of-type) [data-header-transparent]:not(.meganav--visible):not(.js__header__stuck) .header__logo--has-transparent .logo__img--color').css('opacity', '1');
}
  });

  
  $(window).scroll(function (event) {
    didScroll = true;
  });

  setInterval(function () {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    if (Math.abs(lastScrollTop - st) <= delta) return;
    if (st > lastScrollTop && st > navbarHeight) {
      $(".header__wrapper")
        .removeClass("js__header__stuck")
        .addClass("aos-animate");
    } else if (st === 0) {
      $(".header__wrapper")
        .removeClass("js__header__stuck")
        .addClass("aos-animate");
    } else {
      if (st + $(window).height() < $(document).height()) {
        $(".header__wrapper")
          .addClass("js__header__stuck")
          .removeClass("aos-animate");
      }
    }
    lastScrollTop = st;
  }
  
  $('.sliderow').click(function() {
    $(this).toggleClass('is-active')
    $(this).siblings('.mobile__menu__dropdown').toggleClass('is-visible');
    let slideRule = $(this).siblings('.mobile__menu__dropdown').data('sliderule');
    let parentMenu = $(this).parents('.drawer__menu').get(0);
    parentMenu.dataset.sliderulePane = slideRule;
  });
  
})();

document.addEventListener("theme:quick-add:open", function (event) {
  let openedModals = document.querySelectorAll(".product-quick-add");
  const currentModal = openedModals[openedModals.length - 1];
  const config = {
    productId: currentModal.dataset.productId,
    injectionParent:
      "form#product-form-upsell-api-product-upsell-" +
      currentModal.dataset.productId,
    injectionMethod: "prepend",
  };
  if (currentModal.querySelectorAll(".rc-widget").length === 0) {
    window.ReChargeWidget.createWidget(config);
  }
});