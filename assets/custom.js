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

      // // Add event listeners for mouse interactions to each 'timeline__inner' element
      // slider.addEventListener('mousemove', move);
      // slider.addEventListener('mousedown', startDragging);
      // slider.addEventListener('mouseup', stopDragging);
      
      // // Add scroll event listener to check if scroll reaches the end
      // slider.addEventListener('scroll', () => {
      //   if (slider.scrollLeft === (slider.scrollWidth - slider.clientWidth)) {
      //     // Scroll has reached the end, apply width: 370% to timeline__indicator__line
      //     indicatorLine.style.width = '45%';
      //   } else {
      //     // Scroll has not reached the end, reset width to default or any other value
      //     indicatorLine.style.width = ''; // Resets width to default
      //   }
      // });
//     });
//   }
// });


document.addEventListener('DOMContentLoaded', function() {
//Timeline click to scroll to element

  
  // Select all elements with the class 'timeline__inner'
  const timelineInners = document.querySelectorAll('.timeline__inner');
  
  // Iterate over each 'timeline__inner' element
  timelineInners.forEach(function(timelineInner) {
    // Select all timeline__row elements within the current timeline__inner
    const timelineRows = timelineInner.querySelectorAll('.timeline__row');
    const containerWidth = timelineInner.clientWidth;
    const indicatorLine = timelineInner.querySelector('.timeline__indicator__line');

    const totalWidth = timelineRows.length * timelineRows[0].offsetWidth;
 // Add click event listener to each timeline__row within the current timeline__inner
    timelineRows.forEach(function(row, index) {
      row.addEventListener('click', function() {
        // Calculate the desired scroll position to center the clicked row
        let scrollTo;
        if (index === timelineRows.length - 1 && window.innerWidth > 1300) {
          // If the clicked row is the last one and the screen width is larger than 1300px, scroll to the end
          scrollTo = timelineInner.scrollWidth;
        } else {
          // Otherwise, calculate the scroll position to center the clicked row
          const clickedRowOffset = row.offsetLeft; // Left offset of the clicked row relative to the container
          const containerWidth = timelineInner.offsetWidth; // Width of the container
          scrollTo = clickedRowOffset - (containerWidth / 2) + (row.offsetWidth / 2);
        }

        // Ensure the scroll position stays within the bounds of the scrollable area
        scrollTo = Math.max(0, scrollTo);

        // Scroll the container to the desired position with smooth scrolling
        timelineInner.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        });
      });
    });

            timelineInner.addEventListener('scroll', () => {
      if (timelineInner.scrollLeft === (timelineInner.scrollWidth - timelineInner.clientWidth)) {
        // Scroll has reached the end, apply width: 40% to timeline__indicator__line
        indicatorLine.style.width = '40%';
      } else {
        // Scroll has not reached the end, reset width to default or any other value
        indicatorLine.style.width = ''; // Resets width to default
      }
      });
  
  });


// Sliders Custom
// Check if any .flickity-enabled-custom element exists
const flickityEnabledContainers = document.querySelectorAll(".flickity-enabled-custom");
if (flickityEnabledContainers.length > 0) {
  flickityEnabledContainers.forEach((container) => {
    // Find the .flickity__container-custom element within the current container
    const slideContainer = container.querySelector(".flickity__container-custom");
    if (!slideContainer) return; // Skip if the slide container is not found
    // Find the .flickity-page-dots-custom element within the current container
    const dotContainer = container.querySelector(".flickity-page-dots-custom");
    if (!dotContainer) return; // Skip if the dot container is not found

    let lastStyledButton = null; // Variable to store the previously styled button

    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, forIndex) => {
        if (entry.intersectionRatio >= .1) {
          // If the entire slide is in the viewport, add the 'slide-is-visible' class
          entry.target.classList.add("slide-is-visible");
          // Get the data-slide-position attribute value
          const slidePosition = entry.target.getAttribute("data-slide-position");
          if (slidePosition) {
            // Find the button with the matching data-dot-position attribute
            const button = dotContainer.querySelector(`.flickity-page-dot[data-dot-position="${slidePosition}"]`);
            if (button) {
              // Remove the 'flickity-dot-styling' class from the previously styled button
              if (lastStyledButton) {             
                lastStyledButton.classList.remove("flickity-dot-styling");
              }
              console.log(button)
              // Add the 'flickity-dot-styling' class to the current button
              button.classList.add("flickity-dot-styling");
              // Update the lastStyledButton to the current button
              lastStyledButton = button;
            }
          }
        } else {
          // If the slide is not fully in the viewport, remove the 'slide-is-visible' class
          entry.target.classList.remove("slide-is-visible");
          // Get the data-slide-position attribute value
          const slidePosition = entry.target.getAttribute("data-slide-position");
          if (slidePosition) {
            // Find the button with the matching data-dot-position attribute
            const button = dotContainer.querySelector(`.flickity-page-dot[data-dot-position="${slidePosition}"]`);
            if (button) {
              // Remove the 'flickity-dot-styling' class from the button
              button.classList.remove("flickity-dot-styling");
              // If this button is the lastStyledButton, reset the lastStyledButton to null
              if (button === lastStyledButton) {
                lastStyledButton = null;
              }
            }
          }
        }
      });
    }, {
      threshold: [.85] // Trigger the callback
    });

    // Observe each slide item within the slide container
    const slideItems = slideContainer.querySelectorAll('.flickity_item_container-custom');
    slideItems.forEach((item) => {
      observer.observe(item);
    });

    // Add event listener to each button within this container
    const buttons = dotContainer.querySelectorAll('.flickity-page-dot');
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        console.log(button);
        const slidePosition = button.getAttribute("data-dot-position");
        if (slidePosition) {
          const slide = slideContainer.querySelector(`.flickity_item_container-custom[data-slide-position="${slidePosition}"]`);
          console.log(slide);
          if (slide) {
            // Scroll to the corresponding slide within this container
            const newPosition = slide.offsetLeft;
            console.log(newPosition);
            slideContainer.scroll({
              left: newPosition,
              behavior: 'smooth' // Smooth scrolling effect
            });
          }
        }
      });
    });
  });
}





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

async function changeItemQtywithReload(lineItem, qty) {
  var formData = new FormData();
  formData.append(`updates[${lineItem}]`, qty);
  await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
    document.dispatchEvent(eventReload);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function removeMultiple(lineItems) {
  var formData = new FormData();
  lineItems.forEach((el) => {
    formData.append(`updates[${el}]`, 0);
  });
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

async function removeMultiplewithReload(lineItems) {
  var formData = new FormData();
  lineItems.forEach((el) => {
    formData.append(`updates[${el}]`, 0);
  });
  await fetch(window.Shopify.routes.root + 'cart/update.js', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
    document.dispatchEvent(eventReload);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

async function showMessageDuplicateRoutine(lineItem) {
  let cartItems = document.querySelector('.cart-alert');
  cartItems.innerHTML = '';
  cartItems.innerHTML = `<div class="alert-confirm">
    <p class="cart__item__title cart__item__alert-custom">${window.theme.cartSettings.singleRoutine.alert}</p>
    <div class="buttons-holder">
      <button type="button" data-replace-alert data-remove-product=${lineItem} class="btn btn--primary btn--solid">Replace</button>
      <button type="button" data-dismiss-alert class="btn btn--primary btn--outline">Keep Both</button>
    </div>
  </div>`;
  let replaceButton = cartItems.querySelector('[data-replace-alert]');
  let closeButton = cartItems.querySelector('[data-dismiss-alert]');
  replaceButton.addEventListener("click", (e) => {
    changeItemQtywithReload(replaceButton.dataset.removeProduct, '0');
    cartItems.innerHTML = '';
  });
  closeButton.addEventListener("click", (e) => {
    cartItems.innerHTML = '';
  });
}

async function showMessageDuplicateProducts(lineItems, isRoutine) {
  let cartItems = document.querySelector('.cart-alert');
  cartItems.innerHTML = '';
  if (isRoutine) {
    var message = window.theme.cartSettings.duplication.alert_routine;
  } else {
    var message = window.theme.cartSettings.duplication.alert_product;
  }
  var buttonOne = 'Remove';
  var buttonTwo = 'Keep';
  cartItems.innerHTML = `<div class="alert-confirm">
    <p class="cart__item__title cart__item__alert-custom">${message}</p>
    <div class="buttons-holder">
      <button type="button" data-remove-alert data-remove-products class="btn btn--primary btn--solid">${buttonOne}</button>
      <button type="button" data-dismiss-alert class="btn btn--primary btn--outline">${buttonTwo}</button>
    </div>
  </div>`;
  let replaceButton = cartItems.querySelector('[data-remove-alert]');
  let closeButton = cartItems.querySelector('[data-dismiss-alert]');
  replaceButton.addEventListener("click", (e) => {
    removeMultiplewithReload(lineItems);
    cartItems.innerHTML = '';
  });
  closeButton.addEventListener("click", (e) => {
    cartItems.innerHTML = '';
  });
}

async function addedCartFunction(addedItem, data) {
  let alertStatus = '',
      alertMessage = '',
      reloadCart = false;
  const allProducts = theme.cartSettings.products;
  let isCurrentAddedItemRoutine = allProducts[addedItem.product_id].isRoutine;
  // Free Item Addition
  if (theme.cartSettings.giftItem.enabled) {
    let giftExists = data.items.filter((item) => item.product_id == theme.cartSettings.giftItem.productId);
    if (giftExists.length > 0) {
      let giftQty = giftExists[0]['quantity'];

      if (giftQty > 1) {
        reloadCart = true;
        await changeItemQty(giftExists[0].key, '1');
      }
    }
    
    if (theme.cartSettings.giftItem.method == "cart") {
      let minCartValue = parseInt(theme.cartSettings.giftItem.cartValue * 100);
      if (data.total_price > minCartValue) {
        if (giftExists.length === 0) {
          reloadCart = true;
          alertStatus = 'success';
          alertMessage = window.theme.cartSettings.giftItem.success_alert;
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        if (giftExists.length > 0) {
          reloadCart = true;
          alertStatus = 'error';
          alertMessage = window.theme.cartSettings.giftItem.error_alert;
          await changeItemQty(giftExists[0].key, '0');
        }
      }
    } else {
      let eligibleProducts = theme.cartSettings.giftItem.collection.split(",").map( Number );
      if (eligibleProducts.includes(addedItem.product_id)) {
        if (giftExists.length === 0) {
          reloadCart = true;
          alertStatus = 'success';
          alertMessage = window.theme.cartSettings.giftItem.success_alert;
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        let eligibleItemsinCart = data.items.filter(item => eligibleProducts.includes(item.product_id));
        if (eligibleItemsinCart.length === 0 && giftExists.length > 0) {
          reloadCart = true;
          alertStatus = 'error';
          alertMessage = window.theme.cartSettings.giftItem.error_alert;
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
      if (window.theme.cartSettings.singleRoutine.show_alert) {
        // await changeItemQty(routineItem.key, '0');
        await showMessageDuplicateRoutine(routineItem.key);
        return;
      }
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
        reloadCart = true;
        alertStatus = 'success';
        alertMessage = window.theme.cartSettings.upgradability.alert;
        let itemRemove = data.items.filter((item) => item.variant_id == upgradeItem)[0].key;
        await removeMultiple([itemRemove, routineItem.key]);
        await addItemtoCart(upgradeSystem);
        var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
        document.dispatchEvent(eventReload);
        const eventAlert = new CustomEvent("theme:cart-drawer:alert", { detail: { status: alertStatus, message: alertMessage } });
        document.dispatchEvent(eventAlert);
        return;
      }
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
      let haveCommonItems = otherItemIds.filter(item => variantsOfRoutine.includes(item));
      let commonItemsKeys = data.items.filter(item => haveCommonItems.includes(item.variant_id)).map((item) => item.key);
      if (commonItemsKeys.length > 0) {
        // await removeMultiple(commonItemsKeys);
        await showMessageDuplicateProducts(commonItemsKeys, isCurrentAddedItemRoutine);
        return;
      }
    }
  }

  if (reloadCart) {
    var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
    document.dispatchEvent(eventReload);
  }

  if (alertStatus != null && alertMessage != null) {
    const eventAlert = new CustomEvent("theme:cart-drawer:alert", { detail: { status: alertStatus, message: alertMessage } });
    document.dispatchEvent(eventAlert);
  }
}

async function updatedCartFunction(data) {
  let alertStatus = '',
      alertMessage = '',
      reloadCart = false;
  
  const allProducts = theme.cartSettings.products;
  
  if (theme.cartSettings.giftItem.enabled) {
    let giftExists = data.items.filter((item) => item.product_id == theme.cartSettings.giftItem.productId);
    if (giftExists.length > 0) {
      let giftQty = giftExists[0]['quantity'];

      if (giftQty > 1) {
        reloadCart = true;
        await changeItemQty(giftExists[0].key, '1');
      }
    }
    
    if (theme.cartSettings.giftItem.method == "cart") {
      let minCartValue = parseInt(theme.cartSettings.giftItem.cartValue * 100);
      if (data.total_price > minCartValue) {
        if (giftExists.length === 0) {
          reloadCart = true;
          alertStatus = 'success';
          alertMessage = window.theme.cartSettings.giftItem.success_alert;
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        if (giftExists.length > 0) {
          reloadCart = true;
          alertStatus = 'error';
          alertMessage = window.theme.cartSettings.giftItem.error_alert;
          await changeItemQty(giftExists[0].key, '0');
        }
      }
    } else {
      let eligibleProducts = theme.cartSettings.giftItem.collection.split(",").map( Number );
      let eligibleItemsinCart = data.items.filter(item => eligibleProducts.includes(item.product_id));
      if (eligibleItemsinCart.length > 0) {
        if (giftExists.length === 0) {
          reloadCart = true;
          alertStatus = 'success';
          alertMessage = window.theme.cartSettings.giftItem.success_alert;
          await addItemtoCart(theme.cartSettings.giftItem.variantId);
        }
      } else {
        if (giftExists.length > 0) {
          reloadCart = true;
          alertStatus = 'error';
          alertMessage = window.theme.cartSettings.giftItem.error_alert;
          await changeItemQty(giftExists[0].key, '0');
        }
      }
    }
  }

  if (reloadCart) {
    var eventReload = new Event('theme:cart-drawer:reload', { bubbles: true, cancelable: false });
    document.dispatchEvent(eventReload);
  }

  if (alertStatus != '' && alertMessage != '') {
    const eventAlert = new CustomEvent("theme:cart-drawer:alert", { detail: { status: alertStatus, message: alertMessage } });
    document.dispatchEvent(eventAlert);
  }
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
  fetch(window.theme.routes.cart_url + '.json')
    .then(response => response.json())
    .then(data => {
      updatedCartFunction(data);
    });
});