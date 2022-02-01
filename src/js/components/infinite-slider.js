(() => {
  // COMPONENTS.INFINITE_SLIDER
  const selectors = {
    viewport: '.scroll-slider-viewport',
    container: '.scroll-slider-slides',
    slide: '.scroll-slider-slide',
    prev: '.scroll-slider-prev',
    next: '.scroll-slider-next',
    controls: '.scroll-slider-controls'
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

  function removeClones($container) {
    let $slides = $container.querySelectorAll(selectors.slide);
    $slides.forEach(($slide) => {
      if ($slide.dataset.clone) $slide.remove();
    });
  }

  function getVisibleSlides($container) {
    let $visibleSlides = [...$container.querySelectorAll(selectors.slide)];

    $visibleSlides = $visibleSlides.filter((el) => {
      if (el.hasAttribute('hidden')) return false;
      return true;
    });

    return $visibleSlides;
  }

  function createClone($slide, index, setIndex) {
    let $clone = $slide.cloneNode(true);
    $clone.dataset.clone = true;
    $clone.dataset.index = index;
    $clone.dataset.set = setIndex;
    return $clone;
  }

  function addCloneSet($container, $slides, setIndex) {
    let fragment = document.createDocumentFragment();
    $slides.forEach(($slide, i) => {
      let $clone = createClone($slide, i, setIndex);
      fragment.appendChild($clone);
    });
    $container.appendChild(fragment, $container.children[0]);
  }

  function getActiveConfig(pageWidth, config) {
    if (!config.breakpoints) return config;
    let activeBreakpoint = Object.keys(config.breakpoints)
      .reverse()
      .find((key) => {
        if (key <= pageWidth) return true;
      });

    if (activeBreakpoint) {
      return {
        ...config,
        ...config.breakpoints[activeBreakpoint]
      };
    }
    return config;
  }

  function infiniteSlider(element, config) {
    if (!element) return;
    let $viewport = element.querySelector(selectors.viewport);
    if (!$viewport) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;

    let $prev = element.querySelector(selectors.prev);
    let $next = element.querySelector(selectors.next);

    const emitter = utils.createEmitter();

    let pageWidth, // ширина всей страницы
      activeSlidesCount, // кол-во активных слайдов
      slideWidth, // ширина одного слайда
      sliderShift, // сдвиг слайда влево за пределы страницы
      sideOffset; // расстояние от начала страницы до первого активного слайда

    let trackShift, // смещение трека со слайдами относительно слайдера
      tmpTrackShift,
      initialX, // начало перемещения
      x1,
      x2,
      y1,
      y2, // координаты текущего перемещения
      lastCheckX; // величина сдвига при последнем перемещение слайдов

    let shifting;

    function init() {
      pageWidth = document.body.offsetWidth;

      let activeConfig = getActiveConfig(pageWidth, config);
      activeSlidesCount = activeConfig.slides;

      let offset = activeConfig.offset || 0;
      let isCenter = activeConfig.center;

      removeClones($container);
      const $visibleSlides = getVisibleSlides($container);

      $visibleSlides.forEach((el, i) => {
        el.dataset.index = i;
      });

      slideWidth = $visibleSlides[0].offsetWidth;

      let isFit = pageWidth > slideWidth * activeSlidesCount;

      let setWidth = slideWidth * $visibleSlides.length;

      if (!isCenter) {
        sideOffset = offset;
      } else if (!isFit) {
        sideOffset = offset;
      } else {
        sideOffset = Math.round(
          (pageWidth - slideWidth * activeSlidesCount) / 2
        );
      }

      let setsCount = Math.ceil(pageWidth / setWidth) + 1;
      let cloneSetsCount = Math.max(setsCount - 1, 2);

      for (let i = 0; i < cloneSetsCount; i++) {
        addCloneSet($container, $visibleSlides, i);
      }

      if (!isFit || !isCenter) {
        sliderShift = -1 * setWidth + offset;
      } else {
        sliderShift =
          -1 *
          ((Math.floor(sideOffset / setWidth) + 1) * setWidth - sideOffset);
      }

      $container.style.marginLeft = sliderShift + 'px';

      initialX = 0;
      lastCheckX = 0;

      setTrackShift(0);
      updateActiveSlides();
    }

    function setFirstActiveSlide(index) {
      let lastActiveSlide = index + activeSlidesCount - 1;
      getVisibleSlides($container).forEach((slide, i) => {
        if (i >= index && i <= lastActiveSlide) {
          slide.classList.add(states.active);
        } else {
          slide.classList.remove(states.active);
        }
      });
    }

    function setTrackShift(shift, withoutCheck) {
      trackShift = shift;
      tmpTrackShift = shift;
      $container.style.transform = `translateX(${trackShift}px)`;
      if (!withoutCheck) checkSlidesCountOnTheSides();
    }

    function checkSlidesCountOnTheSides() {
      let checkDiff = trackShift - lastCheckX;
      if (Math.abs(checkDiff) >= slideWidth) {
        moveSlide(checkDiff);
        lastCheckX = trackShift;
      }
    }

    function moveSlide(diff) {
      let slides = getVisibleSlides($container);
      if (diff < 0) {
        $container.appendChild(slides[0]);
        setTrackShift(trackShift + slideWidth);
      } else {
        $container.insertBefore(slides[slides.length - 1], slides[0]);
        setTrackShift(trackShift - slideWidth);
      }
    }

    function getDistanceToFirstActiveSlide() {
      return Math.abs(sliderShift + trackShift) + sideOffset;
    }

    function alignSlider() {
      let distance = getDistanceToFirstActiveSlide();
      let activeSlidesCount = Math.floor(distance / slideWidth);
      let diff = distance - activeSlidesCount * slideWidth;

      if (diff > slideWidth / 2) {
        activeSlidesCount = Math.ceil(distance / slideWidth);
      } else {
        activeSlidesCount = Math.floor(distance / slideWidth);
      }

      tempTransition(() => {
        checkSlidesCountOnTheSides();
        updateActiveSlides();
      });

      setTrackShift(
        -1 * sliderShift + sideOffset - activeSlidesCount * slideWidth,
        'withoutCheck'
      );
    }

    function updateActiveSlides() {
      let distance = getDistanceToFirstActiveSlide();
      let activeSlideIndex = Math.floor(distance / slideWidth);

      setFirstActiveSlide(activeSlideIndex);
    }

    function tempTransition(cb) {
      $container.style.transition = `transform 400ms ease-in-out`;
      $container.addEventListener('transitionend', () => {
        $container.style.transition = '';
        setTimeout(() => {
          cb();
        });
      });
    }

    function toPrevSlide() {
      tempTransition(() => {
        checkSlidesCountOnTheSides();
        updateActiveSlides();
      });

      setTrackShift(trackShift + slideWidth, 'withoutCheck');
    }

    function toNextSlide() {
      tempTransition(() => {
        checkSlidesCountOnTheSides();
        updateActiveSlides();
      });
      setTrackShift(trackShift - slideWidth, 'withoutCheck');
    }

    function onDragStart(e) {
      element.style.userSelect = 'none';

      e = e || window.event;
      initialX = trackShift;
      lastCheckX = trackShift;

      if (e.type == 'touchstart') {
        x1 = e.touches[0].clientX;
        y1 = e.touches[0].clientY;
      } else {
        e.preventDefault();

        x1 = e.clientX;
        y1 = e.clientY;
        document.onmouseup = onDragEnd;
        document.onmousemove = onDragAction;
      }
    }

    function onDragEnd() {
      element.style.cursor = '';
      document.onmouseup = null;
      document.onmousemove = null;
      alignSlider();
      updateActiveSlides();

      setTimeout(() => shifting = false)
    }

    function onDragAction(e) {
      e = e || window.event;

      if (e.type == 'touchmove') {
        x2 = x1 - e.touches[0].clientX;
        x1 = e.touches[0].clientX;
        y2 = y1 - e.touches[0].clientY;
        y1 = e.touches[0].clientY;

        if (shifting) {
          if (e.cancelable) {
            e.preventDefault();
          }

          setTrackShift(trackShift - x2);
          return;
        }

        tmpTrackShift = tmpTrackShift - x2;

        if (Math.abs(tmpTrackShift) > 5 && e.cancelable) {
          e.preventDefault();
          element.style.cursor = 'grabbing';
          shifting = true;
          setTrackShift(tmpTrackShift);
        }
      } else {
        x2 = x1 - e.clientX;
        x1 = e.clientX;
        y2 = y1 - e.clientY;
        y1 = e.clientY;
        shifting = true;
        if (e.cancelable) e.preventDefault();
        setTrackShift(trackShift - x2);
      }
    }

    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);

    init();

    window.addEventListener(
      'resize',
      utils.debounce(() => {
        init();
      }),
      500
    );

    if ($prev) {
      $prev.addEventListener('click', toPrevSlide);
    }
    if ($next) {
      $next.addEventListener('click', toNextSlide);
    }

    element.addEventListener('click', (e) => {
      if (shifting) e.preventDefault();
    });

    element.infiniteSlider = {
      update() {
        init();
      }
    };
  }

  window.components = window.components || {};
  window.components.infiniteSlider = infiniteSlider;
})();
