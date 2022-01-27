(() => {
  // COMPONENTS.SCROLL_SLIDER
  const selectors = {
    viewport: '.scroll-slider-viewport',
    container: '.scroll-slider-slides',
    slide: '.scroll-slider-slide',
    prev: '.scroll-slider-prev',
    next: '.scroll-slider-next',
    controls: '.scroll-slider-controls'
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
    let $slides = [];
    const emitter = utils.createEmitter();
    let slideWidth,
      slidesCount,
      activeSlide = 0;

    let x1 = 0,
      x2 = 0,
      initialX,
      finalX;

    let shifting = false, blocked = false;

    element.addEventListener('click', (e) => {
      if (shifting) e.preventDefault();
    });

    let $offset = document.createElement('div');

    $offset.classList.add(classes.offset);
    $container.insertBefore($offset, $container.children[0]);
    $container.appendChild($offset.cloneNode(true));

    let $prev = element.querySelector(selectors.prev);
    let $next = element.querySelector(selectors.next);
    let $controls = element.querySelector(selectors.controls);

    function orderSlides(index) {
      $slides.forEach((el, i) => {
        el.classList.toggle(states.active, i === index);
        el.setAttribute('data-order', i - index + 1);
      });
    }

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
      setTimeout(() => {
        if ($next)
          $next.disabled =
            $viewport.scrollLeft + $viewport.offsetWidth >=
            $viewport.scrollWidth;
        if ($prev) $prev.disabled = x < 10;
      }, 400);
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
      if (blocked) return;
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
      if (blocked) return;
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
        shifting = true;
        alignSlider(1);
        emitter.emit(events.touched);
      } else if (finalX - initialX > THRESHOLD) {
        shifting = true;
        alignSlider(-1);
        emitter.emit(events.touched);
      } else {
        scrollTo(initialX, true);
      }

      element.style.userSelect = '';
      element.style.cursor = '';

      document.onmouseup = null;
      document.onmousemove = null;

      setTimeout(() => {
        shifting = false;
      });
    }

    window.addEventListener('resize', () => {
      slideWidth = $slides[0].offsetWidth;
      scrollToActiveSlide();
    });

    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);

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
        if (
          $viewport.scrollLeft + $viewport.offsetWidth <
          $viewport.scrollWidth
        ) {
          setActiveSlide(activeSlide + 1);
          scrollToActiveSlide(true);
        }
      });
    }

    function init() {
      $slides = [...$container.querySelectorAll(selectors.slide)].filter(
        (el) => !el.hasAttribute('hidden')
      );
      slideWidth = $slides[0].offsetWidth;
      slidesCount = $slides.length;
      activeSlide = 0;

      if ($prev) $prev.disabled = true;
      if ($next) $next.disabled = false;

      $viewport.scrollLeft = 0;

      orderSlides(activeSlide);

      if ($viewport.scrollWidth - $viewport.offsetWidth <= 40) {
        blocked = true;
        if ($next) $next.disabled = true;
      } else {
        blocked = false;
        if ($next) $next.disabled = false;
      }
    }

    init();

    element.scrollSlider = {
      update() {
        init();
      }
    };
  }

  window.components = window.components || {};
  window.components.scrollSlider = scrollSlider;
})();
