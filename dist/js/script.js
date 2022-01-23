"use strict";

window.utils = {
  createEmitter: function createEmitter() {
    var cbs = {};

    function addEventCb(eventName, cb) {
      if (!(eventName in cbs)) cbs[eventName] = [];
      cbs[eventName].push(cb);
    }

    function removeEventCb(eventName, cb) {
      if (!(eventName in cbs)) return;
      if (!cb) cbs[eventName] = [];else cbs[eventName] = cbs[eventName].filter(function (_cb) {
        return cb === cb;
      });
    }

    function on(eventName, cb) {
      if (Array.isArray(eventName)) {
        eventName.forEach(function (e) {
          addEventCb(e, cb);
        });
      } else {
        addEventCb(eventName, cb);
      }
    }

    function off(eventName, cb) {
      if (Array.isArray(eventName)) {
        eventName.forEach(function (e) {
          return removeEventCb(e, cb);
        });
      } else {
        removeEventCb(eventName, cb);
      }
    }

    function emit(eventName, data) {
      if (!(eventName in cbs)) return;
      var eventCbs = cbs[eventName];
      if (!Array.isArray(eventCbs) || !eventCbs.length) return;
      eventCbs.forEach(function (cb) {
        return cb(data);
      });
    }

    return {
      on: on,
      off: off,
      emit: emit
    };
  }
};
"use strict";

var header = document.getElementById('header-2');
"use strict";

(function () {
  var selectors = {
    slider: '.s-slider',
    wrapper: '.s-slider-wrapper',
    container: '.s-slider-slides',
    slide: '.s-slider-slide',
    pagination: '.s-slider-pagination'
  };
  var states = {
    shifting: 'shifting',
    loaded: 'loaded'
  };
  var events = {
    changeSlide: 's-slider_change_slide',
    clickPagination: 's-slider_click_pagination',
    touched: 's-slider_touched'
  };
  var THRESHOLD = 100;
  var AUTO_MOVE_PERIOD = 4000;

  function SingleSlider($slider) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!$slider) return;
    var $container = $slider.querySelector(selectors.container);
    if (!$container) return;
    var $slides = $container.querySelectorAll(selectors.slide);
    var slidesCount = $slides.length;
    if (slidesCount < 2) return;
    var emitter = utils.createEmitter();
    var sliderWidth = $container.offsetWidth;
    var currentIndex = 0;
    var allowShift = true;

    function changeIndex(newIndex) {
      currentIndex = newIndex;
      emitter.emit(events.changeSlide, newIndex);
    }

    var x1 = 0,
        x2 = 0,
        initialX,
        finalX;
    var $firstSlide = $slides[0];
    var $lastSlide = $slides[slidesCount - 1];
    var $firstSlideClone = $firstSlide.cloneNode(true);
    var $lastSlideClone = $lastSlide.cloneNode(true);
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

    window.addEventListener('resize', function () {
      sliderWidth = $container.offsetWidth;
      var offset = -1 * (currentIndex * sliderWidth) - sliderWidth;
      $container.style.left = offset + 'px';
    });
    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);
    $container.addEventListener('transitionend', checkIndex);
    var $pagination = $slider.querySelector(selectors.pagination);

    if ($pagination) {
      var $paginationItems = Array(slidesCount).fill(null).map(function (_, i) {
        var $item = document.createElement('div');
        $item.dataset.slide = i;
        $pagination.appendChild($item);
        $item.addEventListener('click', function () {
          shiftToSlide(i);
          emitter.emit(events.clickPagination);
        });
        return $item;
      });
      $paginationItems[0].classList.add('active');
      emitter.on(events.changeSlide, function (index) {
        $paginationItems.forEach(function ($item, i) {
          $item.classList.toggle('active', i === index);
        });
      });
    }

    if (config.autoMove) {
      var autoMove = function autoMove() {
        shiftSlide(1);
        timerId = setTimeout(autoMove, AUTO_MOVE_PERIOD);
      };

      var timerId = null;

      var cb = function cb() {
        clearTimeout(timerId);
        emitter.off([events.touched, events.clickPagination], cb);
      };

      timerId = setTimeout(autoMove, AUTO_MOVE_PERIOD);
      emitter.on([events.touched, events.clickPagination], cb);
    }

    $slider.classList.add(states.loaded);
  }

  document.querySelectorAll(selectors.slider).forEach(function (el) {
    SingleSlider(el, {
      autoMove: true
    });
  });
})();
"use strict";

var i = 5;
var k = 10;
var k2 = 10;