(() => {
  const selectors = {
    container: '.scroll-slider-slides',
    slide: '.scroll-slider-slide',
    pagination: '.scroll-slider-pagination'
  };

  const classes = {
    offset: 'scroll-slider-offset'
  }

  const events = {
    changeSlide: 'scroll-slider_change_slide'
  };

  function scrollSlider(element) {
    if (!element) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;
    let $slides = $container.querySelectorAll(selectors.slide);

    const emitter = utils.createEmitter();
    let slidesCount = $slides.length;

    let $offset = document.createElement('div');
    $offset.classList.add(classes.offset);
    $container.insertBefore($offset, $slides[0]);
    $container.appendChild($offset.cloneNode(true));

  }

  window.scrollSlider = scrollSlider;
})()
