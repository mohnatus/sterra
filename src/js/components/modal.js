(() => {
  // COMPONENTS.MODAL
  const selectors = {
    container: '.modal-container',
    close: '.modal-close'
  };

  const classes = {
    mask: 'modal-mask'
  };

  const events = {
    show: 'modal-show',
    hide: 'modal-hide',
    countChanged: 'modals-count-changed'
  };

  let unique = 1;

  const collection = {
    modals: [],
    add(modal) {
      this.modals.push(modal);
      this._onChange();
    },
    remove(modal) {
      this.modals = this.modals.filter((m) => m !== modal);
      this._onChange();
    },
    _onChange() {
      let count = this.modals.length;
      document.body.classList.toggle('modals-shown', count > 0);
      utils.emitter.emit(events.countChanged, count);
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (collection.modals.length) {
        let lastModal = collection.modals[collection.modals.length - 1];
        lastModal.hide();
      }
    }
  });

  function modal(element) {
    if (!element) return;

    document.body.append(element);
    const $container = element.querySelector(selectors.container);

    let isOpen = false;
    const id = unique++;

    const emitter = utils.createEmitter();

    function show() {
      emitter.emit(events.show);
      element.removeAttribute('hidden');
    }

    function hide() {
      emitter.emit(events.hide);
      element.setAttribute('hidden', true);
    }

    const instance = {
      show,
      hide,
      id
    };

    emitter.on(events.show, () => {
      utils.emitter.emit(events.show, id);
      isOpen = true;
      collection.add(instance);
    });

    emitter.on(events.hide, () => {
      utils.emitter.emit(events.hide, id);
      isOpen = false;
      collection.remove(instance);
    });

    let $mask = document.createElement('div');
    $mask.classList.add(classes.mask);
    $container.insertBefore($mask, $container.children[0]);
    $mask.addEventListener('click', () => hide());

    let $triggers = element.querySelectorAll(selectors.close);
    $triggers.forEach(($el) => {
      $el.addEventListener('click', () => hide());
    });

    return instance;
  }

  window.components = window.components || {};
  window.components.modal = modal;
  window.components.modals = collection;
})();
