/*
 * Broadcast Theme
 *
 * Use this file to add custom Javascript to Broadcast.  Keeping your custom
 * Javascript in this fill will make it easier to update Broadcast. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 */
function checkAndRemoveHeaderStuck() {
  // Check if the user has scrolled up
  if (window.scrollY < lastScrollTop) {
    // Check if the user is at the top of the viewport
    if (window.scrollY === 0) {
      // Check if the header has the js__header__stuck class
      if ($(".header__wrapper").hasClass("js__header__stuck")) {
        // Check if the user is at the top of the document
        if (document.documentElement.scrollTop === 0) {
          // Remove the js__header__stuck class from the header
          $(".header__wrapper").removeClass("js__header__stuck");
        }
      }
    }
  }
}

// Run the function every 250 milliseconds
setInterval(checkAndRemoveHeaderStuck, 250);

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
  }, 50);

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
        // console.log(st)
        // console.log(st + $(window).height() )
        // console.log($(document).height())
        
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
  let addedItem = e.detail.response;
  console.log(addedItem.handle);

  // Free Item Addition
  if (theme.cartSettings.giftItem.enabled) {
    fetch(window.theme.routes.cart_url + '.json')
    .then(response => response.json())
    .then(data => {
      let giftExists = data.items.filter((item) => item.product_id == theme.cartSettings.giftItem.productId).length;
      if (theme.cartSettings.giftItem.method == "cart") {
        let minCartValue = parseInt(theme.cartSettings.giftItem.cartValue * 100);
        if (data.total_price > minCartValue) {
          if (!giftExists) {
            let formData = {
             'items': [{
              'id': theme.cartSettings.giftItem.variantId,
              'quantity': 1
              }]
            };
            fetch(window.Shopify.routes.root + 'cart/add.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
              console.log('Event Triggered');
              openCartDrawer();
            })
            .catch((error) => {
              console.error('Error:', error);
            });
          }
        } else {
          if (giftExists) {
            // Remove Gift Item
          }
        }
      } else {
        
      }
    });
  }
  


  fetch("https://tiege-hanley-store.myshopify.com/products/level-1-acne-routine-1?view=json")
  .then(response => response.json())
  .then(data => console.log(data));

  fetch("https://tiege-hanley-store.myshopify.com/products/level-2-advanced-acne-routine-1?view=json")
  .then(response => response.json())
  .then(data => console.log(data));
});

document.addEventListener('theme:cart:change', function(e) {
  console.log(e);
});