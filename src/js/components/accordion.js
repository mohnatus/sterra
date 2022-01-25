(() => {
  const selectors = {
    item: '.accordion-item',
    trigger: '.accordion-trigger',
    panel: '.accordion-item-panel'
  };

  const states = {
    active: 'active'
  };

  function accordion($element) {
    if (!$element) return;

    const $items = $element.querySelectorAll(selectors.item);

    if (!$items.length) return;

    const items = [];
    $items.forEach(($item) => {
      let trigger = $item.querySelector(selectors.trigger);
      let panel = $item.querySelector(selectors.panel);
      items.push({
        element: $item,
        trigger,
        panel
      });
    });

    let activeItem = items[0];

    function closePanel(item) {
      item.element.classList.remove(states.active);
      item.panel.style.height = 0;
    }

    function openPanel(item) {
      item.element.classList.add(states.active);
      item.panel.style.height = item.panel.scrollHeight + 'px';
    }

    function toggleItem(item) {
      console.log('toggle item', item, activeItem);
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

    items.forEach((item) => {
      if (item.trigger) {
        item.trigger.addEventListener('click', () => toggleItem(item));
      }
    });

    window.addEventListener('resize', () => {
      if (activeItem) {
        activeItem.panel.style.transition = 'none';
        activeItem.panel.style.height = 0;
        activeItem.panel.style.height = activeItem.panel.scrollHeight + 'px';
        setTimeout(() => {
          activeItem.panel.style.transition = '';
        });
      }
    });
  }

  window.accordion = accordion;
})();
