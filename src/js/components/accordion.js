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
      let collapsiblePanel = collapsible(panel, 400);
      items.push({
        element: $item,
        trigger,
        panel: collapsiblePanel
      });
    });

    let activeItem = items[0];

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

    items.forEach((item) => {
      if (item.trigger) {
        item.trigger.addEventListener('click', () => toggleItem(item));
      }
    });

    window.addEventListener('resize', () => {
      if (activeItem) {
        activeItem.panel.resize();
      }
    });
  }

  window.accordion = accordion;
})();
