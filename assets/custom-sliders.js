document.addEventListener('DOMContentLoaded', function() {
  console.log('Runs')
  // Check if any .flickity__container-custom element exists
  const slideContainers = document.querySelectorAll(".flickity__container-custom");
  if (slideContainers.length > 0) {
    // Create a new Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.95) {
          // If at least 95% of the slide is in the viewport, add the 'is-visible' class
          entry.target.classList.add("is-visible");
        } else {
          // If the slide is not in the viewport, remove the 'is-visible' class
          entry.target.classList.remove("is-visible");
        }
      });
    }, {
      threshold: [0.95] // Specify the threshold for triggering the callback
    });

    // Observe each slide container
    slideContainers.forEach((slide) => {
      observer.observe(slide);
    });
  }
});
