(() => {
  const selectors = {
    viewport: '.scroll-slider-viewport',
    container: '.scroll-slider-slides',
    slide: '.scroll-slider-slide',
    prev: '.scroll-slider-prev',
    next: '.scroll-slider-next'
  };

  const classes = {
    offset: 'scroll-slider-offset'
  };

  const states = {
    shifting: 'shifting',
    loaded: 'loaded',
    active: 'active'
  };

  const events = {
    changeSlide: 'scroll-slider_change_slide',
    clickPagination: 'scroll-slider_click_pagination',
    touched: 'scroll-slider_touched'
  };

  const THRESHOLD = 100;

  function scrollSlider(element) {
    if (!element) return;
    let $viewport = element.querySelector(selectors.viewport);
    if (!$viewport) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;
    let $slides = $container.querySelectorAll(selectors.slide);

    const emitter = utils.createEmitter();
    let slideWidth = $slides[0].offsetWidth;
    let slidesCount = $slides.length;
    let activeSlide = 0;

    function orderSlides(index) {
      $slides.forEach((el, i) => {
        el.classList.toggle(states.active, i === index);
        el.setAttribute('data-order', i - index + 1);
      });
    }

    orderSlides(activeSlide);

    let x1 = 0,
      x2 = 0,
      initialX,
      finalX;

    let $offset = document.createElement('div');
    $offset.classList.add(classes.offset);
    $container.insertBefore($offset, $slides[0]);
    $container.appendChild($offset.cloneNode(true));

    function setActiveSlide(index) {
      activeSlide = index;
      emitter.emit(events.changeSlide);

      orderSlides(index);
    }

    function scrollTo(x, smooth) {
      $viewport.scrollTo({
        left: x,
        behavior: smooth && 'smooth'
      });
    }

    function scrollToActiveSlide(smooth) {
      let diff = slideWidth * activeSlide;
      scrollTo(diff, smooth);
    }

    function alignSlider(dir) {
      let scroll = $viewport.scrollLeft;

      let index =
        dir < 0
          ? Math.ceil(scroll / slideWidth)
          : Math.floor(scroll / slideWidth);

      setActiveSlide(index);

      scrollToActiveSlide(true);
    }

    function onDragStart(e) {
      element.style.userSelect = 'none';
      element.style.cursor = 'grabbing';

      e = e || window.event;
      e.preventDefault();
      initialX = $viewport.scrollLeft;

      if (e.type == 'touchstart') {
        x1 = e.touches[0].clientX;
      } else {
        x1 = e.clientX;
        document.onmouseup = onDragEnd;
        document.onmousemove = onDragAction;
      }
    }

    function onDragAction(e) {
      e = e || window.event;

      if (e.type == 'touchmove') {
        x2 = x1 - e.touches[0].clientX;
        x1 = e.touches[0].clientX;
      } else {
        x2 = x1 - e.clientX;
        x1 = e.clientX;
      }

      scrollTo(x2 + $viewport.scrollLeft);
    }

    function onDragEnd(e) {
      finalX = $viewport.scrollLeft;

      if (finalX - initialX < -THRESHOLD) {
        alignSlider(1);
        emitter.emit(events.touched);
      } else if (finalX - initialX > THRESHOLD) {
        alignSlider(-1);
        emitter.emit(events.touched);
      } else {
        scrollTo(initialX, true);
      }

      element.style.userSelect = '';
      element.style.cursor = '';

      document.onmouseup = null;
      document.onmousemove = null;
    }

    window.addEventListener('resize', () => {
      slideWidth = $slides[0].offsetWidth;
      scrollToActiveSlide();
    });

    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);

    let $prev = element.querySelector(selectors.prev);
    let $next = element.querySelector(selectors.next);

    if ($prev) {
      $prev.addEventListener('click', () => {
        if (activeSlide > 0) {
          setActiveSlide(activeSlide - 1);
          scrollToActiveSlide(true);
        }
      });
    }

    if ($next) {
      $next.addEventListener('click', () => {
        if (activeSlide < slidesCount - 2) {
          setActiveSlide(activeSlide + 1);
          scrollToActiveSlide(true);
        }
      });
    }
  }

  window.components = window.components || {};
  window.components.scrollSlider = scrollSlider;
})();
