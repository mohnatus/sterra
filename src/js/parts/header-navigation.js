(() => {
  // PARTS.HEADER_NAVIGATION
  const $header = document.querySelector('.header');
  if (!$header) return;

  const $navigation = $header.querySelector('.header-navigation');
  if (!$navigation) return;

  const $itemsWithMenu = $navigation.querySelectorAll('[data-submenu]');
  const items = [];
  $itemsWithMenu.forEach(($item) => {
    let $panel = $item.querySelector(`.header-navigation-pane`);
    if (!$panel) return;

    let $mask = document.createElement('div');
    $mask.classList.add('header-navigation-pane__mask');
    $panel.insertBefore($mask, $panel.children[0]);

    let $block = $panel.querySelector('.header-navigation-pane__block');

    items.push({
      element: $item,
      block: $block,
      panel: $panel,
      mask: $mask
    });
  });

  let activeItem = null; // открытая вкладка
  let fixedActiveItem = null; // зафиксированная (клик) вкладка

  function openItem(item) {
    item.panel.removeAttribute('hidden');
    document.body.classList.add('header-pane-opened');
  }
  function closeItem(item) {
    item.panel.setAttribute('hidden', true);
    document.body.classList.remove('header-pane-opened');
  }

  items.forEach((item) => {
    item.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('header-navigation-pane__mask')) return;
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

    item.element.addEventListener('mouseenter', (e) => {
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

    item.mask.addEventListener('mouseenter', (e) => {
      if (e.target === e.currentTarget) {
        if (activeItem === item && fixedActiveItem !== item) {
          closeItem(item);
        }
      }
    });

    item.mask.addEventListener('click', (e) => {
      console.log('mask click', item, activeItem)

        if (activeItem === item) {
          closeItem(item);
          activeItem = null;
          fixedActiveItem = null;
        }

    });

    item.element.addEventListener('mouseleave', (e) => {
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

  document.addEventListener('click', (e) => {
    if (!activeItem) return;
    if (e.target.closest('.header-navigation-pane')) return;
    if (e.target.closest('[data-submenu]')) return;
    items.forEach((item) => {
      closeItem(item, 'click outside');
      activeItem = null;
      fixedActiveItem = null;
    });
  });
})();
