(() => {
  function autoHeight(element) {
    let defaultHeight = 50;

    function inputHandler() {
      element.style.height = defaultHeight + 'px';
      let height = element.scrollHeight;

      element.style.height = height + 'px';
    }

    element.style.resize = 'none';
    element.style.overflowY = 'hidden';
    element.style.height = element.scrollHeight + 'px';

    element.addEventListener('input', inputHandler);
    element.addEventListener('change', inputHandler);

    setTimeout(() => {
      inputHandler();
    }, 4);
  }

  window.components = window.components || {};
  window.components.autoHeight = autoHeight;

  document.querySelectorAll('textarea').forEach((el) => autoHeight(el));
})();
