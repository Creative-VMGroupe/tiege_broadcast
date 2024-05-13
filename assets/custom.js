/*
 * Broadcast Theme
 *
 * Use this file to add custom Javascript to Broadcast.  Keeping your custom
 * Javascript in this fill will make it easier to update Broadcast. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 */
//Timeline
//Timeline Horizontal Scroll on Desktop
// document.addEventListener('DOMContentLoaded', () => {
//   if (window.innerWidth > 750) {
//     // Select all elements with the class 'timeline__inner'
//     const sliders = document.querySelectorAll('.timeline__inner');

//     // Iterate over each 'timeline__inner' element
//     sliders.forEach(slider => {
//       let mouseDown = false;
//       let startX, scrollLeft;
//       const indicatorLine = slider.querySelector('.timeline__indicator__line');
      
//       const startDragging = (e) => {
//         mouseDown = true;
//         startX = e.pageX - slider.offsetLeft;
//         scrollLeft = slider.scrollLeft;
//       };

//       const stopDragging = () => {
//         mouseDown = false;
//       };

//       const move = (e) => {
//         e.preventDefault();
//         if (!mouseDown) { return; }
//         const x = e.pageX - slider.offsetLeft;
//         const scroll = x - startX;
//         slider.scrollLeft = scrollLeft - scroll;
//       };

//       // Add event listeners for mouse interactions to each 'timeline__inner' element
//       slider.addEventListener('mousemove', move);
//       slider.addEventListener('mousedown', startDragging);
//       slider.addEventListener('mouseup', stopDragging);
      
//       // Add scroll event listener to check if scroll reaches the end
//       slider.addEventListener('scroll', () => {
        // if (slider.scrollLeft === (slider.scrollWidth - slider.clientWidth)) {
        //   // Scroll has reached the end, apply width: 370% to timeline__indicator__line
        //   indicatorLine.style.width = '45%';
        // } else {
        //   // Scroll has not reached the end, reset width to default or any other value
        //   indicatorLine.style.width = ''; // Resets width to default
        // }
//       });
//     });
//   }
// });

//Timeline click to scroll to element
document.addEventListener('DOMContentLoaded', function() {
  // Select the timelineInner container
  const timelineInner = document.querySelectorAll('.timeline__inner'); 
  // Select all timeline__row elements
  const timelineRows = document.querySelectorAll('.timeline__row');
  
  // Add click event listener to each timeline__row
  timelineRows.forEach(function(row) {
    row.addEventListener('click', function() {
      const indicatorLine = row.querySelector('.timeline__indicator__line');
      console.log('Clicked')
      // Scroll timelineInner to the clicked row's position
      timelineInner.scrollLeft = row.offsetLeft;

        if (row.scrollLeft === (row.scrollWidth - row.clientWidth)) {
                console.log('Applied')
          // Scroll has reached the end, apply width: 370% to timeline__indicator__line
          indicatorLine.style.width = '45%';
        } else {
                console.log('Not applied')
          // Scroll has not reached the end, reset width to default or any other value
          indicatorLine.style.width = ''; // Resets width to default
        }
        
    });
  });
});



//Header
// Variable to store the last scroll position
var lastScrollTop = 0;

// Event listener to update the last scroll position and check if the user scrolled up
$(window).scroll(function (event) {
  var currentScrollTop = window.scrollY;
  // Check if the user scrolled up
  if (currentScrollTop < lastScrollTop) {
    // Check if the user is at the top of the viewport
    if (currentScrollTop === 0) {
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
  // Update the last scroll position
  lastScrollTop = currentScrollTop;
});

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

           
        });
    }
});

//  https://tiege-hanley-store.myshopify.com/

async function addItemtoCart(variantId) {
  let formData = {
   'items': [
     {
      'id': variantId,
      'quantity': 1
    }
   ]
  };
  await fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {})
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function changeItemQty(lineItem, qty) {
  var formData = new FormData();
  formData.append(`updates[${lineItem}]`, qty);
  await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {})
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function removeMultiple(lineItemOne, lineItemTwo) {
  var formData = new FormData();
  formData.append(`updates[${lineItemOne}]`, 0);
  formData.append(`updates[${lineItemTwo}]`, 0);
  await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {})
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function addedCartFunction(addedItem, data) {
  let alertStatus = 'One',
      alertMessage = 'Two';
  const allProducts = theme.cartSettings.products;
  let isCurrentAddedItemRoutine = allProducts[addedItem.product_id].isRoutine;
  // Free Item Addition
  if (theme.cartSettings.giftItem.enabled) {
    let giftExists = data.items.filter((item) => item.product_id == theme.cartSettings.giftItem.productId);
    if (giftExists.length) {
      let giftQty = giftExists[0]['quantity'];

      if (giftQty > 1) {
        await changeItemQty(giftExists[0].key, '1');
      }
    }
    
    if (theme.cartSettings.giftItem.method == "cart") {
      let minCartValue = parseInt(theme.cartSettings.giftItem.cartValue * 100);
      if (data.total_price > minCartValue) {
        if (!giftExists.length) {
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        if (giftExists.length) {
          await changeItemQty(giftExists[0].key, '0');
        }
      }
    } else {
      let eligibleProducts = theme.cartSettings.giftItem.collection.split(",").map( Number );
      if (eligibleProducts.includes(addedItem.product_id)) {
        if (!giftExists.length) {
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        if (giftExists.length) {
          await changeItemQty(giftExists[0].key, '0');
        }
      }
    }
  }

  // Single Routine Checks
  if (theme.cartSettings.singleRoutine.enabled && isCurrentAddedItemRoutine) {
    let routineItem = null;
    data.items.forEach((element) => {
      if (allProducts[element.product_id].isRoutine && element.product_id != addedItem.product_id) {
        routineItem = element;
      }
    });
    if (routineItem != null) {
      await changeItemQty(routineItem.key, '0');
    }
  }

  // Duplication Check
  if (theme.cartSettings.duplication.enabled) {
    let routineItem = null;
    data.items.forEach((element) => {
      if (allProducts[element.product_id].isRoutine) {
        routineItem = element;
      }
    });
    if (routineItem != null) {
      let otherItems = data.items.filter((item) => item.product_id != routineItem.product_id);
      let otherItemIds = otherItems.map((item) => item.variant_id);
      let variantsOfRoutine = allProducts[routineItem.product_id]['routineVariants'].map((item) => item.id);
      let haveCommonItems = otherItemIds.some(item => variantsOfRoutine.includes(item));
      // Remove Common Element
      console.log(otherItems, otherItemIds, variantsOfRoutine, haveCommonItems);
    }
  }

  // Upgradability Check
  if (theme.cartSettings.upgradability.enabled) {
    let routineItem = null;
    data.items.forEach((element) => {
      if (allProducts[element.product_id].isRoutine) {
        routineItem = element;
      }
    });
    if (routineItem != null) {
      let otherItems = data.items.filter((item) => item.product_id != routineItem.product_id);
      let otherItemIds = otherItems.map((item) => item.variant_id);
      let upgradeItem = allProducts[routineItem.product_id].nextRoutineLineItem != false ? allProducts[routineItem.product_id].nextRoutineLineItem.id : false;
      let upgradeSystem = allProducts[routineItem.product_id].nextRoutine != false ? allProducts[routineItem.product_id].nextRoutine.variantId : false ;
      if (upgradeSystem != false && otherItemIds.includes(upgradeItem)) {
        let itemRemove = data.items.filter((item) => item.variant_id == upgradeItem)[0].key;
        console.log(data.items, itemRemove, routineItem);
        await removeMultiple(itemRemove, routineItem.key);
        await addItemtoCart(upgradeSystem);
      }
    }
  }

  var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
  document.dispatchEvent(eventReload);

  if (alertStatus != null && alertMessage != null) {
    const eventAlert = new CustomEvent("theme:cart-drawer:alert", { detail: { status: alertStatus, message: alertMessage } });
    document.dispatchEvent(eventAlert);
  }
}

async function updatedCartFunction() {
  // Update Cart function
}

document.addEventListener('theme:product:add', function(e) {
  let addedItem = e.detail.response;
  fetch(window.theme.routes.cart_url + '.json')
    .then(response => response.json())
    .then(data => {
      addedCartFunction(addedItem, data);
    });
});

document.addEventListener('theme:cart:change', function(e) {
  // Check Conditions on Load as well
});