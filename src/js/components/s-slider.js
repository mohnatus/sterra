(() => {
  const selectors = {
    slider: '.s-slider',
    wrapper: '.s-slider-wrapper',
    container: '.s-slider-slides',
    slide: '.s-slider-slide',
    pagination: '.s-slider-pagination'
  };

  const states = {
    shifting: 'shifting',
    loaded: 'loaded'
  };

  const events = {
    changeSlide: 's-slider_change_slide',
    clickPagination: 's-slider_click_pagination',
    touched: 's-slider_touched'
  };

  const THRESHOLD = 100;

  const AUTO_MOVE_PERIOD = 4000;



  function SingleSlider($slider, config = {}) {
    if (!$slider) return;
    const $container = $slider.querySelector(selectors.container);
    if (!$container) return;
    const $slides = $container.querySelectorAll(selectors.slide);
    const slidesCount = $slides.length;
    if (slidesCount < 2) return;

    const emitter = utils.createEmitter();

    let sliderWidth = $container.offsetWidth;
    let currentIndex = 0;
    let allowShift = true;

    function changeIndex(newIndex) {
      currentIndex = newIndex;
      emitter.emit(events.changeSlide, newIndex);
    }

    let x1 = 0,
      x2 = 0,
      initialX,
      finalX;

    const $firstSlide = $slides[0];
    const $lastSlide = $slides[slidesCount - 1];
    const $firstSlideClone = $firstSlide.cloneNode(true);
    const $lastSlideClone = $lastSlide.cloneNode(true);

    $container.appendChild($firstSlideClone);
    $container.insertBefore($lastSlideClone, $firstSlide);
    $container.style.left = -1 * sliderWidth + 'px';

    function shiftToSlide(slideIndex) {
      if (currentIndex === slideIndex) return;

      $container.classList.add(states.shifting);

      if (allowShift) {
        $container.style.left = -1 * (slideIndex + 1) * sliderWidth + 'px';
        changeIndex(slideIndex);
      }
    }

    function shiftSlide(dir, action) {
      $container.classList.add(states.shifting);

      if (allowShift) {
        if (!action) {
          initialX = $container.offsetLeft;
        }

        if (dir == 1) {
          $container.style.left = initialX - sliderWidth + 'px';
          changeIndex(currentIndex + 1);
        } else if (dir == -1) {
          $container.style.left = initialX + sliderWidth + 'px';
          changeIndex(currentIndex - 1);
        }
      }

      allowShift = false;
    }

    function checkIndex() {
      $container.classList.remove(states.shifting);

      if (currentIndex == -1) {
        $container.style.left = -(slidesCount * sliderWidth) + 'px';
        changeIndex(slidesCount - 1);
      }

      if (currentIndex == slidesCount) {
        $container.style.left = -(1 * sliderWidth) + 'px';
        changeIndex(0);
      }

      allowShift = true;
    }

    function onDragStart(e) {
      e = e || window.event;
      e.preventDefault();
      initialX = $container.offsetLeft;

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
      $container.style.left = $container.offsetLeft - x2 + 'px';
    }

    function onDragEnd(e) {
      finalX = $container.offsetLeft;
      if (finalX - initialX < -THRESHOLD) {
        shiftSlide(1, 'drag');
        emitter.emit(events.touched);
      } else if (finalX - initialX > THRESHOLD) {
        shiftSlide(-1, 'drag');
        emitter.emit(events.touched);
      } else {
        $container.style.left = initialX + 'px';
      }

      document.onmouseup = null;
      document.onmousemove = null;
    }

    window.addEventListener('resize', () => {
      sliderWidth = $container.offsetWidth;

      let offset = -1 * (currentIndex * sliderWidth) - sliderWidth;
      $container.style.left = offset + 'px';
    });

    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);
    $container.addEventListener('transitionend', checkIndex);

    let $pagination = $slider.querySelector(selectors.pagination);

    if ($pagination) {
      const $paginationItems = Array(slidesCount)
        .fill(null)
        .map((_, i) => {
          let $item = document.createElement('div');
          $item.dataset.slide = i;
          $pagination.appendChild($item);
          $item.addEventListener('click', () => {
            shiftToSlide(i);
            emitter.emit(events.clickPagination);
          });
          return $item;
        });
      $paginationItems[0].classList.add('active');

      emitter.on(events.changeSlide, (index) => {
        $paginationItems.forEach(($item, i) => {
          $item.classList.toggle('active', i === index);
        });
      });
    }

    if (config.autoMove) {
      let timerId = null;

      const cb = () => {
        clearTimeout(timerId);
        emitter.off([events.touched, events.clickPagination], cb);
      };

      function autoMove() {
        shiftSlide(1);
        timerId = setTimeout(autoMove, AUTO_MOVE_PERIOD);
      }

      timerId = setTimeout(autoMove, AUTO_MOVE_PERIOD);

      emitter.on([events.touched, events.clickPagination], cb);
    }

    $slider.classList.add(states.loaded);
  }

  // document.querySelectorAll(selectors.slider).forEach((el) => {
  //   SingleSlider(el, {
  //     autoMove: true
  //   });
  // });
})();
