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
      }
    }
    return config;
  }

  function infiniteSlider(element, config) {
    if (!element) return;
    let $viewport = element.querySelector(selectors.viewport);
    if (!$viewport) return;
    let $container = element.querySelector(selectors.container);
    if (!$container) return;

    const emitter = utils.createEmitter();

    let pageWidth, // ширина всей страницы
      activeSlidesCount, // кол-во активных слайдов
      slideWidth, // ширина одного слайда
      sliderShift, // сдвиг слайда влево за пределы страницы
      sideOffset; // расстояние от начала страницы до первого активного слайда

    let trackShift, // смещение трека со слайдами относительно слайдера
      initialX, // начало перемещения
      x1,
      x2, // координаты текущего перемещения
      lastCheckX; // величина сдвига при последнем перемещение слайдов

    function init() {

      pageWidth = document.body.offsetWidth;

      let activeConfig = getActiveConfig(pageWidth, config);

      activeSlidesCount = activeConfig.slides;

      removeClones($container);
      const $visibleSlides = getVisibleSlides($container);

      $visibleSlides.forEach((el, i) => {
        el.dataset.index = i;
      });

      slideWidth = $visibleSlides[0].offsetWidth;
      let setWidth = slideWidth * $visibleSlides.length;
      sideOffset = Math.round((pageWidth - slideWidth * activeSlidesCount) / 2);

      let setsCount = Math.ceil(pageWidth / setWidth) + 1;
      let cloneSetsCount = Math.max(setsCount - 1, 2);

      for (let i = 0; i < cloneSetsCount; i++) {
        addCloneSet($container, $visibleSlides, i);
      }

      sliderShift =
        -1 * ((Math.floor(sideOffset / setWidth) + 1) * setWidth - sideOffset);
      $container.style.marginLeft = sliderShift + 'px';

      initialX = 0;

      setTrackShift(0);
    }

    function setTrackShift(shift) {
      trackShift = shift;
      $container.style.transform = `translateX(${trackShift}px)`;
      checkSlidesCountOnTheSides();
    }

    function checkSlidesCountOnTheSides() {
      let checkDiff = trackShift - lastCheckX;
      if (Math.abs(checkDiff) > slideWidth) {
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

    function alignSlider() {
      let distance = Math.abs(sliderShift + trackShift) + sideOffset;
      let activeSlidesCount = Math.floor(distance / slideWidth);
      let diff = distance - activeSlidesCount * slideWidth;

      if (diff > slideWidth / 2) {
        activeSlidesCount = Math.ceil(distance / slideWidth);
      } else {
        activeSlidesCount = Math.floor(distance / slideWidth);
      }
      setTrackShift(
        -1 * sliderShift + sideOffset - activeSlidesCount * slideWidth
      );
    }

    function updateActiveSlides() {
      
    }

    function onDragStart(e) {
      element.style.userSelect = 'none';
      element.style.cursor = 'grabbing';

      e = e || window.event;
      e.preventDefault();
      initialX = trackShift;
      lastCheckX = trackShift;

      if (e.type == 'touchstart') {
        x1 = e.touches[0].clientX;
      } else {
        x1 = e.clientX;
        document.onmouseup = onDragEnd;
        document.onmousemove = onDragAction;
      }
    }

    function onDragEnd() {
      document.onmouseup = null;
      document.onmousemove = null;
      alignSlider();
      updateActiveSlides();
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

      setTrackShift(trackShift - x2);
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
  }

  window.components = window.components || {};
  window.components.infiniteSlider = infiniteSlider;
})();
