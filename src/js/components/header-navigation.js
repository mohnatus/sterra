(() => {
  const $header = document.querySelector('.header');
  if (!$header) return;

  const $navigation = $header.querySelector('.header-navigation');
  if (!$navigation) return;

  const $itemsWithMenu = $navigation.querySelectorAll('[data-submenu]');
  const items = [];
  $itemsWithMenu.forEach(($item) => {
    let panelName = $item.dataset.submenu;
    let $panel = document.querySelector(`[data-pane="${panelName}"]`);
    if (!$panel) return;

    items.push({
      element: $item,
      panel: $panel
    });
  });

  let activeItem = null;
  function openItem(item) {
    activeItem = item;
    item.panel.removeAttribute('hidden');
  }
  function closeItem(item) {
    if (activeItem === item) activeItem = null;
    item.panel.setAttribute('hidden', true);
  }
  function toggleItem(item) {
    if (activeItem === item) {
      closeItem(item);
    } else {
      if (activeItem) closeItem(activeItem);
      openItem(item);
    }
  }

  items.forEach((item) => {
    item.element.addEventListener('click', () => {
      toggleItem(item);
    });
  });

  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.header-navigation-pane')) return;
    if (e.target.closest('[data-submenu]')) return;
    items.forEach((item) => closeItem(item));
  });
})();
