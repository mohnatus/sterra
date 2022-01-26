"use strict";

(function () {
  function collapsible(el, duration) {
    el.style.height = 0;
    el.style.overflow = 'hidden';
    var transition = "height ".concat(duration, "ms ease-in-out");
    el.style.transition = transition;
    var opened = false;

    function open() {
      setTimeout(function () {
        opened = true;
        el.style.height = el.scrollHeight + 'px';
      });
    }

    function close() {
      setTimeout(function () {
        opened = false;
        el.style.height = 0;
      });
    }

    function toggle() {
      if (opened) close();else open();
    }

    function resize() {
      el.style.transition = '';
      el.style.height = 0;
      setTimeout(function () {
        el.style.height = el.scrollHeight + 'px';
        setTimeout(function () {
          el.style.transition = transition;
        });
      });
    }

    return {
      open: open,
      close: close,
      resize: resize,
      toggle: toggle
    };
  }

  window.utils = window.utils || {};
  window.utils.collapsible = collapsible;
})();
"use strict";

(function () {
  function createEmitter() {
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

  window.utils = window.utils || {};
  window.utils.createEmitter = createEmitter;
  window.utils.emitter = createEmitter();
})();
"use strict";

(function () {
  function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;

      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  window.utils = window.utils || {};
  window.utils.debounce = debounce;
})();
"use strict";

(function () {
  function addMediaQueryListener(query, cb) {
    var mqList = window.matchMedia(query);
    cb(mqList.matches);

    function check(e) {
      cb(e.matches);
    }

    mqList.addEventListener('change', check);
  }

  window.utils = window.utils || {};
  window.utils.addMediaQueryListener = addMediaQueryListener;
})();
"use strict";

(function () {
  function getScrollbarWidth() {
    var documentWidth = parseInt(document.documentElement.clientWidth);
    var windowsWidth = parseInt(window.innerWidth);
    var scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
  }

  window.utils = window.utils || {};
  window.utils.getScrollbarWidth = getScrollbarWidth;
})();
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  var events = {
    touch: 'form-validator-touch',
    changeStatus: 'form-validator-change-status'
  };

  function validateInput(field, rules) {
    return {
      isValid: true,
      error: ''
    };
  }

  function validateCheckbox(field, rules) {
    return {
      isValid: true,
      error: ''
    };
  }

  function validator(form, rules) {
    var emitter = utils.createEmitter();
    var submitted = false;
    var $submitButton = form.querySelector('[type="submit"]');
    $submitButton.classList.add('disabled');
    var fields = Object.entries(rules).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          fieldName = _ref2[0],
          fieldRules = _ref2[1];

      var field = form.elements[fieldName];
      if (!field) return;
      var validator;

      if (field.tagName === 'TEXTAREA') {
        validator = validateInput;
      } else if (field.type === 'checkbox') {
        validator = validateCheckbox;
      } else if (field.type === 'text') {
        validator = validateInput;
      }

      if (!validator) return;
      var fieldData = {
        name: fieldName,
        element: field,
        type: field.type,
        rules: fieldRules,
        touched: false,
        errorText: false,
        validator: validator,
        $error: null
      };

      function setError() {
        if (!submitted || fieldData.isValid) {
          if (fieldData.$error) {
            fieldData.$error.detach();
          }

          fieldData.element.classList.remove('invalid');
        } else {
          if (!fieldData.$error) {
            fieldData.$error = document.createElement('div');
            fieldData.$error.addClass('form-error');
          }

          fieldData.$error.textContent = fieldData.errorText;
          fieldData.element.parentElement.insertBefore(fieldData.$error, fieldData.element.nextElementSibling);
          fieldData.element.classList.add('invalid');
        }
      }

      function onChange() {
        if (!fieldData.touched) {
          fieldData.touched = true;
          emitter.emit(events.touch);
        }

        var _fieldData$validator = fieldData.validator(field, fieldRules),
            error = _fieldData$validator.error,
            isValid = _fieldData$validator.isValid;

        fieldData.errorText = error;
        fieldData.isValid = isValid;
        setError();
        emitter.emit(events.changeStatus);
      }

      field.addEventListener('change', onChange);
      field.addEventListener('input', onChange);
      return _objectSpread(_objectSpread({}, fieldData), {}, {
        setError: setError
      });
    }).filter(Boolean);
    emitter.on(events.changeStatus, function () {
      var hasInvalidFields = fields.some(function (f) {
        return !f.isValid;
      });
      console.log('changestatus', hasInvalidFields, submitted);

      if (!hasInvalidFields) {
        if (submitted) {
          $submitButton.disabled = true;
        } else {
          $submitButton.classList.add('disabled');
        }
      } else {
        $submitButton.disabled = false;
        $submitButton.classList.remove('disabled');
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!submitted) {
        submitted = true;
        fields.forEach(function (f) {
          return f.setError();
        });
      }

      var hasInvalidFields = fields.some(function (f) {
        return !f.isValid;
      });

      if (!hasInvalidFields) {
        form.submit();
      }
    });
  }

  window.utils = window.utils || {};
  window.utils.validator = validator;
})();
"use strict";

(function () {
  var selectors = {
    item: '.accordion-item',
    trigger: '.accordion-trigger',
    panel: '.accordion-item-panel'
  };
  var states = {
    active: 'active'
  };

  function accordion($element) {
    if (!$element) return;
    var $items = $element.querySelectorAll(selectors.item);
    if (!$items.length) return;
    var items = [];
    $items.forEach(function ($item) {
      var trigger = $item.querySelector(selectors.trigger);
      var panel = $item.querySelector(selectors.panel);
      var collapsiblePanel = utils.collapsible(panel, 400);
      items.push({
        element: $item,
        trigger: trigger,
        panel: collapsiblePanel
      });
    });
    var activeItem = items[0];

    function closePanel(item) {
      item.element.classList.remove(states.active);
      item.panel.close();
    }

    function openPanel(item) {
      item.element.classList.add(states.active);
      item.panel.open();
    }

    function toggleItem(item) {
      if (item === activeItem) {
        closePanel(item);
        activeItem = null;
        return;
      }

      if (activeItem) closePanel(activeItem);
      openPanel(item);
      activeItem = item;
    }

    openPanel(activeItem);
    items.forEach(function (item) {
      if (item.trigger) {
        item.trigger.addEventListener('click', function () {
          return toggleItem(item);
        });
      }
    });
    window.addEventListener('resize', function () {
      if (activeItem) {
        activeItem.panel.resize();
      }
    });
  }

  window.components = window.components || {};
  window.components.accordion = accordion;
})();
"use strict";

(function () {
  function autoHeight(element) {
    var defaultHeight = 50;

    function inputHandler() {
      element.style.height = defaultHeight + 'px';
      var height = element.scrollHeight;
      element.style.height = height + 'px';
    }

    element.style.resize = 'none';
    element.style.overflowY = 'hidden';
    element.style.height = element.scrollHeight + 'px';
    element.addEventListener('input', inputHandler);
    element.addEventListener('change', inputHandler);
    setTimeout(function () {
      inputHandler();
    }, 4);
  }

  window.components = window.components || {};
  window.components.autoHeight = autoHeight;
  document.querySelectorAll('textarea').forEach(function (el) {
    return autoHeight(el);
  });
})();
"use strict";

(function () {
  var selectors = {
    field: '[data-field]',
    reset: '[data-reset]',
    list: '[data-list]'
  };
  var MIN_LENGTH = 2;
  var id = 1;

  function autocomplete(el) {
    var $field = el.querySelector(selectors.field);
    var $reset = el.querySelector(selectors.reset);
    var $list = el.querySelector(selectors.list);
    if (!$field || !$list) return;
    var action = el.action;
    var method = el.method;
    var actualId = null;

    function updateList(items) {
      if (!items.length) {
        var _el = document.createElement('li');

        _el.classList.add('search-list-empty');

        _el.textContent = 'Ничего не найдено';
        $list.innerHTML = '';
        $list.appendChild(_el);
        return;
      }

      var fragment = document.createDocumentFragment();
      items.forEach(function (item) {
        var el = document.createElement('div');
        var link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.text;
        el.appendChild(link);
        fragment.appendChild(el);
      });
      $list.innerHTML = '';
      $list.appendChild(fragment);
    }

    function showList() {
      $list.removeAttribute('hidden');
    }

    function hideList() {
      $list.setAttribute('hidden', true);
    }

    function loadOptions(q) {
      var requestId = id++;
      actualId = requestId;
      return fetch(action + "?q=".concat(q), {
        method: method
      }).then(function (res) {
        if (requestId === actualId) return res.json();
        throw new Error({
          error: 'The request is irrelevant',
          requestId: requestId
        });
      }).then(function (res) {
        return res.items;
      });
    }

    function resetList() {
      hideList();
      actualId = null;
      updateList([]);
    }

    var onInput = utils.debounce(function () {
      var value = $field.value;

      if (value.length < MIN_LENGTH) {
        resetList();
        return;
      }

      loadOptions(value).then(function (items) {
        updateList(items);
        showList();
      })["catch"](function (_ref) {
        var error = _ref.error,
            requestId = _ref.requestId;
        console.log(error, requestId);
      });
    }, 500);
    $field.addEventListener('input', onInput);
    el.addEventListener('submit', function (e) {
      e.preventDefault();
      onInput();
    });

    if ($reset) {
      $reset.addEventListener('click', function () {
        utils.emitter.emit('close-search');
        $field.value = '';
        resetList();
      });
    }

    document.addEventListener('click', function (e) {
      if ($field.contains(e.target)) return;
      if ($list.contains(e.target)) return;
      $field.value = '';
      resetList();
    });
  }

  window.components = window.components || {};
  window.components.autocomplete = autocomplete;
  document.querySelectorAll('[data-search]').forEach(function (el) {
    return autocomplete(el);
  });
})();
"use strict";

(function () {
  var selectors = {
    container: '.fade-slider-slides',
    slide: '.fade-slider-slide',
    pagination: '.fade-slider-pagination'
  };
  var classes = {
    paginationItem: 'fade-slider-pagination__item'
  };
  var events = {
    changeSlide: 'fade-slider_change_slide'
  };
  var states = {
    active: 'active',
    paginationActive: 'active'
  };
  var THRESHOLD = 100;

  function fadeSlider(element) {
    if (!element) return;
    var $container = element.querySelector(selectors.container);
    if (!$container) return;
    var $slides = $container.querySelectorAll(selectors.slide);
    if ($slides.length < 2) return;
    var emitter = utils.createEmitter();
    var slidesCount = $slides.length;
    var activeSlide = 0;
    var initialX,
        x1,
        x2,
        offset = 0;

    function changeSlide(index) {
      activeSlide = index;
      emitter.emit(events.changeSlide, index);
    }

    function move(diff) {
      offset = diff; // element.style.transform = `translateX(${diff}px)`;
    }

    function toSlide(index) {
      console.log(index, activeSlide);
      $slides[activeSlide].classList.remove(states.active);
      $slides[index].classList.add(states.active);
      changeSlide(index);
    }

    function prev() {
      var index = activeSlide > 0 ? activeSlide - 1 : slidesCount - 1;
      toSlide(index);
    }

    function next() {
      var index = activeSlide + 1;
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
      var finalX = x2;
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
    var $pagination = element.querySelector(selectors.pagination);

    if ($pagination) {
      var setActivePaginationItem = function setActivePaginationItem(index) {
        $paginationItems.forEach(function ($item, i) {
          $item.classList.toggle(states.paginationActive, index === i);
        });
      };

      var $paginationItems = Array(slidesCount).fill(null).map(function (el, i) {
        var $item = document.createElement('div');
        $item.classList.add(classes.paginationItem);
        $item.dataset.slide = i;
        $pagination.appendChild($item);
        $item.addEventListener('click', function () {
          toSlide(i);
        });
        return $item;
      });
      setActivePaginationItem(activeSlide);
      emitter.on(events.changeSlide, function (slideIndex) {
        return setActivePaginationItem(slideIndex);
      });
    }
  }

  window.components = window.components || {};
  window.components.fadeSlider = fadeSlider;
})();
"use strict";

(function () {
  var selectors = {
    container: '.modal-container',
    close: '.modal-close'
  };
  var classes = {
    mask: 'modal-mask'
  };
  var events = {
    show: 'modal-show',
    hide: 'modal-hide',
    countChanged: 'modals-count-changed'
  };
  var unique = 1;
  var collection = {
    modals: [],
    add: function add(modal) {
      this.modals.push(modal);

      this._onChange();
    },
    remove: function remove(modal) {
      this.modals = this.modals.filter(function (m) {
        return m !== modal;
      });

      this._onChange();
    },
    _onChange: function _onChange() {
      var count = this.modals.length;
      document.body.classList.toggle('modals-shown', count > 0);
      utils.emitter.emit(events.countChanged, count);
    }
  };
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Escape') {
      if (collection.modals.length) {
        var lastModal = collection.modals[collection.modals.length - 1];
        lastModal.hide();
      }
    }
  });

  function modal(element) {
    if (!element) return;
    document.body.append(element);
    var $container = element.querySelector(selectors.container);
    var isOpen = false;
    var id = unique++;
    var emitter = utils.createEmitter();

    function show() {
      emitter.emit(events.show);
      element.removeAttribute('hidden');
    }

    function hide() {
      emitter.emit(events.hide);
      element.setAttribute('hidden', true);
    }

    var instance = {
      show: show,
      hide: hide,
      id: id
    };
    emitter.on(events.show, function () {
      utils.emitter.emit(events.show, id);
      isOpen = true;
      collection.add(instance);
    });
    emitter.on(events.hide, function () {
      utils.emitter.emit(events.hide, id);
      isOpen = false;
      collection.remove(instance);
    });
    var $mask = document.createElement('div');
    $mask.classList.add(classes.mask);
    $container.insertBefore($mask, $container.children[0]);
    $mask.addEventListener('click', function () {
      return hide();
    });
    var $triggers = element.querySelectorAll(selectors.close);
    $triggers.forEach(function ($el) {
      $el.addEventListener('click', function () {
        return hide();
      });
    });
    return instance;
  }

  window.components = window.components || {};
  window.components.modal = modal;
  window.components.modals = collection;
})();
"use strict";

(function () {
  var selectors = {
    viewport: '.scroll-slider-viewport',
    container: '.scroll-slider-slides',
    slide: '.scroll-slider-slide',
    prev: '.scroll-slider-prev',
    next: '.scroll-slider-next',
    controls: '.scroll-slider-controls'
  };
  var classes = {
    offset: 'scroll-slider-offset'
  };
  var states = {
    shifting: 'shifting',
    loaded: 'loaded',
    active: 'active'
  };
  var events = {
    changeSlide: 'scroll-slider_change_slide',
    clickPagination: 'scroll-slider_click_pagination',
    touched: 'scroll-slider_touched'
  };
  var THRESHOLD = 100;

  function scrollSlider(element) {
    if (!element) return;
    var $viewport = element.querySelector(selectors.viewport);
    if (!$viewport) return;
    var $container = element.querySelector(selectors.container);
    if (!$container) return;
    var $slides = [];
    var emitter = utils.createEmitter();
    var slideWidth,
        slidesCount,
        activeSlide = 0;
    var x1 = 0,
        x2 = 0,
        initialX,
        finalX;
    var shifting = false;
    element.addEventListener('click', function (e) {
      if (shifting) e.preventDefault();
    });
    var $offset = document.createElement('div');
    $offset.classList.add(classes.offset);
    $container.insertBefore($offset, $container.children[0]);
    $container.appendChild($offset.cloneNode(true));
    var $prev = element.querySelector(selectors.prev);
    var $next = element.querySelector(selectors.next);
    var $controls = element.querySelector(selectors.controls);

    function orderSlides(index) {
      $slides.forEach(function (el, i) {
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
      setTimeout(function () {
        if ($next) $next.disabled = $viewport.scrollLeft + $viewport.offsetWidth >= $viewport.scrollWidth;
        if ($prev) $prev.disabled = x < 10;
      }, 400);
    }

    function scrollToActiveSlide(smooth) {
      var diff = slideWidth * activeSlide;
      scrollTo(diff, smooth);
    }

    function alignSlider(dir) {
      var scroll = $viewport.scrollLeft;
      var index = dir < 0 ? Math.ceil(scroll / slideWidth) : Math.floor(scroll / slideWidth);
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
      setTimeout(function () {
        shifting = false;
      });
    }

    window.addEventListener('resize', function () {
      slideWidth = $slides[0].offsetWidth;
      scrollToActiveSlide();
    });
    $container.onmousedown = onDragStart;
    $container.addEventListener('touchstart', onDragStart);
    $container.addEventListener('touchend', onDragEnd);
    $container.addEventListener('touchmove', onDragAction);

    if ($prev) {
      $prev.addEventListener('click', function () {
        if (activeSlide > 0) {
          setActiveSlide(activeSlide - 1);
          scrollToActiveSlide(true);
        }
      });
    }

    if ($next) {
      $next.addEventListener('click', function () {
        if ($viewport.scrollLeft + $viewport.offsetWidth < $viewport.scrollWidth) {
          setActiveSlide(activeSlide + 1);
          scrollToActiveSlide(true);
        }
      });
    }

    function init() {
      $slides = $container.querySelectorAll(selectors.slide);
      slideWidth = $slides[0].offsetWidth;
      slidesCount = $slides.length;
      activeSlide = 0;
      if ($prev) $prev.disabled = true;
      orderSlides(activeSlide);

      if ($viewport.scrollWidth - $viewport.offsetWidth <= 40) {
        if ($controls) $controls.style.display = 'none';
      }
    }

    init();
  }

  window.components = window.components || {};
  window.components.scrollSlider = scrollSlider;
})();
"use strict";

(function () {
  var $header = document.querySelector('.header');
  if (!$header) return;
  var $headerView = $header.querySelector('.header-view');
  var $navigation = $header.querySelector('.header-navigation');
  if (!$navigation) return;
  var $itemsWithMenu = $navigation.querySelectorAll('[data-submenu]');
  var items = [];
  $itemsWithMenu.forEach(function ($item) {
    var $panel = $item.querySelector(".header-navigation-pane");
    if (!$panel) return;
    items.push({
      element: $item,
      panel: $panel
    });
  });
  var activeItem = null; // открытая вкладка

  var fixedActiveItem = null; // зафиксированная (клик) вкладка

  function openItem(item) {
    item.panel.removeAttribute('hidden');
  }

  function closeItem(item) {
    item.panel.setAttribute('hidden', true);
  }

  items.forEach(function (item) {
    item.element.addEventListener('click', function (e) {
      if (fixedActiveItem === item) {
        if (item.panel.contains(e.target)) return;
        fixedActiveItem = null;
        activeItem = null;
        closeItem(item);
      } else if (activeItem === item) {
        fixedActiveItem = item;
      } else {
        openItem(item);
        activeItem = item;
        fixedActiveItem = item;
      }
    });
    item.element.addEventListener('mouseenter', function (e) {
      if (e.target === e.currentTarget) {
        if (activeItem === item) return;

        if (fixedActiveItem && fixedActiveItem !== item) {
          closeItem(fixedActiveItem);
          fixedActiveItem = null;
        }

        activeItem = item;
        openItem(item);
      }
    });
    item.element.addEventListener('mouseleave', function (e) {
      if (e.target === e.currentTarget) {
        if (fixedActiveItem === item) return;

        if (activeItem === item) {
          closeItem(item, 'mouseleave');
          activeItem = null;
          if (fixedActiveItem === item) fixedActiveItem = null;
        }
      }
    });
  });
  document.body.addEventListener('click', function (e) {
    if (e.target.closest('.header-navigation-pane')) return;
    if (e.target.closest('[data-submenu]')) return;
    items.forEach(function (item) {
      closeItem(item, 'click outside');
      activeItem = null;
      fixedActiveItem = null;
    });
  });
})();
"use strict";

(function () {
  var $header = document.querySelector('.header');
  if (!$header) return;
  var $toggler = $header.querySelector('.header-toggler');
  var $pane = $header.querySelector('.header-pane');
  if (!$toggler || !$pane) return;
  var $headerView = $header.querySelector('.header-view');
  var $paneMask = $pane.querySelector('.header-pane__mask');
  var isLargeScreen = false;
  utils.addMediaQueryListener('(min-width: 1280px)', function (state) {
    isLargeScreen = state;

    if (state) {
      closePane();
    }
  });

  function openPane() {
    if (isLargeScreen) return;
    var scrollbarWidth = utils.getScrollbarWidth();
    $pane.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    $toggler.removeAttribute('data-closed');
    $headerView.style.paddingRight = scrollbarWidth + 'px';
    $headerView.classList.add('header-pane-opened');
  }

  function closePane() {
    $pane.setAttribute('hidden', true);
    document.body.style.overflow = '';
    $toggler.setAttribute('data-closed', true);
    $headerView.style.paddingRight = '';
    $headerView.classList.remove('header-pane-opened');
  }

  function togglePane() {
    var isHidden = $pane.hasAttribute('hidden');
    if (isHidden) openPane();else closePane();
  }

  $toggler.addEventListener('click', function () {
    togglePane();
  });

  if ($paneMask) {
    $paneMask.addEventListener('click', function () {
      closePane();
    });
  }

  utils.emitter.on('modal-show', function () {
    closePane();
  });
})();
"use strict";

(function () {
  var $header = document.querySelector('.header');
  if (!$header) return;
  var $headerView = $header.querySelector('.header-view');
  var $searchBlock = document.querySelector('.header-search');
  var $trigger = $searchBlock.querySelector('.header-search__trigger');
  $trigger.addEventListener('click', function () {
    $headerView.classList.add('header-search-opened');
  });
  utils.emitter.on('close-search', function () {
    $headerView.classList.remove('header-search-opened');
  });
})();
"use strict";

(function () {
  var $header = document.querySelector('.header');
  if (!$header) return;
  document.addEventListener('scroll', function (e) {
    $header.classList.toggle('fixed', document.documentElement.scrollTop > 10);
  }, {
    passive: true
  });
  var $menu = document.querySelector('.header-menu');

  if ($menu) {
    var $menuSections = $menu.querySelectorAll('.header-menu-section');
    $menuSections.forEach(function ($section) {
      var $toggler = $section.querySelector('.header-menu-section__toggler');
      if (!$toggler) return;
      var $sectionList = $section.querySelector('.header-menu-section__items');
      if (!$sectionList) return;
      var list = utils.collapsible($sectionList, 400);
      $toggler.addEventListener('click', function () {
        list.toggle();
      });
    });
  }
})();
"use strict";

(function () {
  var $questionModal = document.getElementById('question');
  if (!$questionModal) return;
  var modal = components.modal($questionModal);
  var triggers = document.querySelectorAll('[data-ask-question]');
  triggers.forEach(function (el) {
    el.addEventListener('click', function () {
      return modal.show();
    });
  });
  window.parts = window.parts || {};
  window.parts.questionModal = modal;
})();
"use strict";

document.documentElement.style.setProperty('--scrollbar-width', utils.getScrollbarWidth() + 'px');
window.addEventListener('resize', function () {
  document.documentElement.style.setProperty('--scrollbar-width', utils.getScrollbarWidth() + 'px');
}, {
  passive: true
});
"use strict";

(function () {
  var isHomePage = document.querySelector('.page').classList.contains('home-page');
  if (!isHomePage) return;
  var homeSlider = document.getElementById('home-slider');

  if (homeSlider) {
    components.fadeSlider(homeSlider);
  }

  var sliders = document.querySelectorAll('.scroll-slider');
  sliders.forEach(function (s) {
    components.scrollSlider(s);
  });
  var faq = document.getElementById('home-faq');

  if (faq) {
    components.accordion(faq);
  }

  var contactForm = document.getElementById('home-contact-form');

  if (contactForm) {
    utils.validator(contactForm, {
      name: {
        required: {}
      }
    });
  }
})();