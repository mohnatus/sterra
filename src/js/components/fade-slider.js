(() => {
  const selectors = {
    container: '.fade-slider-slides',
    slide: '.fade-slider-slide',
    pagination: '.fade-slider-pagination'
  };

  const classes = {
    paginationItem: 'fade-slider-pagination__item'
  }

  const events = {
    changeSlide: 'fade-slider_change_slide'
  };

  const states = {
    paginationActive: 'active'
  };

  function fadeSlider(element) {
    if (!element) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;
    let $slides = $container.querySelectorAll(selectors.slide);
    if ($slides.length < 2) return;

    const emitter = utils.createEmitter();
    let slidesCount = $slides.length;

    let $pagination = element.querySelector(selectors.pagination);
    if ($pagination) {
      let $paginationItems = Array(slidesCount)
        .fill(null)
        .map((el, i) => {
          let $item = document.createElement('div');
          $item.classList.add(classes.paginationItem);
          $item.dataset.slide = i;
          $pagination.appendChild($item);
          return $item;
        });
      function setActivePaginationItem(index) {
        $paginationItems.forEach(($item, i) => {
          $item.classList.toggle(states.paginationActive, index === i);
        });
      }
      setActivePaginationItem(0);
      emitter.on(events.changeSlide, (slideIndex) => setActivePaginationItem(slideIndex));
    }
  }

  window.components = window.components || {};
  window.components.fadeSlider = fadeSlider;
})();
