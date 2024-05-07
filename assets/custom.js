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
        .addClass("js__header_animate");
    } else if (st === 0) {
      $(".header__wrapper")
        .removeClass("js__header__stuck");
    } else {
      if (st + $(window).height() < $(document).height()) {
        $(".header__wrapper")
          .addClass("js__header__stuck")
          .removeClass("js__header_animate");
      }
    }
    lastScrollTop = st;
  }

  $('.header__mobile__hamburger').click(function(){
    if ($(".header__wrapper").hasClass("js__header__stuck")) {
      $(".header__wrapper").removeClass("js__header__stuck");
    }
  });
  
  $('.sliderow').click(function() {
    $(this).toggleClass('is-active')
    $(this).siblings('.mobile__menu__dropdown').toggleClass('is-visible');
    let slideRule = $(this).siblings('.mobile__menu__dropdown').data('sliderule');
    let parentMenu = $(this).parents('.drawer__menu').get(0);
    if (parentMenu.dataset.sliderulePane < slideRule) {
      parentMenu.dataset.sliderulePane = slideRule;
    }
  });

  $("#levelGuideBtn").on("click", function() {
    console.log('Item clicked', $('#level-guide-pop-up'));
    const levelGuidePopUp = document.getElementById('level-guide-pop-up');
    if (levelGuidePopUp) {
      levelGuidePopUp.click();
    }
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

/*Level Guide*/
document.addEventListener('click', function(event) {
  console.log("Level Guide")
    if (event.target && event.target.id === 'levelGuideBtn') {
        console.log('Clicked');
        const levelGuidePopUp = document.getElementById('level-guide-pop-up');
      if (levelGuidePopUp) {
            levelGuidePopUp.click();
        } else {
            console.log('levelGuidePopUp not found');
        }
    }
});

/*Link Tabs*/
document.addEventListener('DOMContentLoaded', function() {
    let linkElements = document.getElementsByClassName("link-tabs__tab");

    for (let i = 0; i < linkElements.length; i++) {
        linkElements[i].addEventListener("click", function() {
            // Remove the class from all elements
            for (let j = 0; j < linkElements.length; j++) {
                if (linkElements[j] !== this) {
                    linkElements[j].classList.remove("link-tab__active__underline");
                }
            }

            // Toggle the class for the clicked element
            this.classList.toggle("link-tab__active__underline");

            console.log('Works');
        });
    }
});

//  https://tiege-hanley-store.myshopify.com/products/{{PRODUCT_HANDLE}}?view=json

document.addEventListener('theme:product:add', function(e) {
  console.log(e);

  fetch(window.theme.routes.cart_url)
  .then(response => response.json())
  .then(data => console.log(data));
});

document.addEventListener('theme:cart:change', function(e) {
  console.log(e);
});