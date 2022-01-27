(() => {
  // UTILS.COLLSPSIBLE
  function collapsible(el, duration) {
    el.style.height = 0;
    el.style.overflow = 'hidden';
    let transition = `height ${duration}ms ease-in-out`;
    el.style.transition = transition;

    let opened = false;

    function open() {
      setTimeout(() => {
        opened = true;
        el.style.height = el.scrollHeight + 'px';
      });
    }

    function close() {
      setTimeout(() => {
        opened = false;
        el.style.height = 0;
      });
    }

    function toggle() {
      if (opened) close();
      else open();
    }

    function resize() {
      el.style.transition = '';

      el.style.height = 0;

      setTimeout(() => {
        el.style.height = el.scrollHeight + 'px';

        setTimeout(() => {
          el.style.transition = transition;
        });
      });
    }

    return {
      open,
      close,
      resize,
      toggle
    };
  }

  window.utils = window.utils || {};
  window.utils.collapsible = collapsible;
})();
