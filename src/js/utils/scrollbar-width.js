(() => {
  function getScrollbarWidth() {
    var documentWidth = parseInt(document.documentElement.clientWidth);
    var windowsWidth = parseInt(window.innerWidth);
    var scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
  }
  window.utils = window.utils || {};
  window.utils.getScrollbarWidth = getScrollbarWidth;
})();
