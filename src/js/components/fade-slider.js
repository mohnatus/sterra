(() => {
  const selectors = {
    container: '.fade-slider-slides',
    slide: '.fade-slider-slide',
    pagination: '.fade-slider-pagination'
  };

  const classes = {
    paginationItem: 'fade-slider-pagination__item'
  };

  const events = {
    changeSlide: 'fade-slider_change_slide'
  };

  const states = {
    active: 'active',
    paginationActive: 'active'
  };

  const THRESHOLD = 100;
  const AUTO_SLIDING_INTERVAL = 4000;

  function fadeSlider(element) {
    if (!element) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;
    let $slides = $container.querySelectorAll(selectors.slide);
    if ($slides.length < 2) return;

    const emitter = utils.createEmitter();
    let slidesCount = $slides.length;
    let activeSlide = 0;

    let initialX,
      x1,
      x2,
      offset = 0;

    function changeSlide(index) {
      activeSlide = index;
      emitter.emit(events.changeSlide, index);
    }

    function move(diff) {
      offset = diff;
      // element.style.transform = `translateX(${diff}px)`;
    }

    function toSlide(index) {
      console.log(index, activeSlide);
      $slides[activeSlide].classList.remove(states.active);
      $slides[index].classList.add(states.active);
      changeSlide(index);
    }

    function prev() {
      let index = activeSlide > 0 ? activeSlide - 1 : slidesCount - 1;
      toSlide(index);
    }

    function next() {
      let index = activeSlide + 1;
      if (index >= slidesCount) index = 0;
      toSlide(index);
    }

    function onDragStart(e) {
      e = e || window.event;
      e.preventDefault();

      element.style.userSelect = 'none';
      element.style.cursor = 'grabbing';

      if (e.type == 'touchstart') {
        x1 = e.touches[0].clientX;
      } else {
        x1 = e.clientX;
        document.onmouseup = onDragEnd;
        document.onmousemove = onDragAction;
      }

      initialX = x1;
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

      move(offset - x2);
    }

    function onDragEnd(e) {
      let finalX = x2;

      console.log(offset, THRESHOLD);

      if (offset < -1 * THRESHOLD) {
        next();
        emitter.emit(events.touched);
      } else if (offset > THRESHOLD) {
        prev();
        emitter.emit(events.touched);
      }

      move(0);

      element.style.userSelect = '';
      element.style.cursor = '';

      document.onmouseup = null;
      document.onmousemove = null;
    }

    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);

    let $pagination = element.querySelector(selectors.pagination);
    if ($pagination) {
      let $paginationItems = Array(slidesCount)
        .fill(null)
        .map((el, i) => {
          let $item = document.createElement('div');
          $item.classList.add(classes.paginationItem);
          $item.dataset.slide = i;
          $pagination.appendChild($item);
          $item.addEventListener('click', () => {
            emitter.emit(events.touched);
            toSlide(i);
          });
          return $item;
        });
      function setActivePaginationItem(index) {
        $paginationItems.forEach(($item, i) => {
          $item.classList.toggle(states.paginationActive, index === i);
        });
      }
      setActivePaginationItem(activeSlide);
      emitter.on(events.changeSlide, (slideIndex) =>
        setActivePaginationItem(slideIndex)
      );
    }

    if (element.hasAttribute('data-auto')) {
      let timer = null;
      function tick() {
        timer = setTimeout(() => {
          next();
          tick();
        }, AUTO_SLIDING_INTERVAL);
      }
      tick();
      emitter.on(events.touched, () => {
        clearTimeout(timer);
      });
    }
  }

  window.components = window.components || {};
  window.components.fadeSlider = fadeSlider;
})();
