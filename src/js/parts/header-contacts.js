(() => {
  // PARTS.CONTACTS
  const $header = document.querySelector('.header');
  if (!$header) return;

  const $contactsBlock = $header.querySelector('.header-contacts');
  if (!$contactsBlock) return;

  const $trigger = $contactsBlock.querySelector('.header-contacts__trigger');
  const $panel = $contactsBlock.querySelector('.header-contacts__pane');

  if (!$trigger || !$panel) return;

  function showPanel() {
    $panel.removeAttribute('hidden');
  }

  function hidePanel() {
    $panel.setAttribute('hidden', true);
  }

  let open = false;
  let fixed = false;

  const emitter = utils.createEmitter();

  emitter.on('show', () => {
    showPanel();
    open = true;
    $trigger.classList.add('opened');
  });

  emitter.on('fix', () => {
    fixed = true;
  });

  emitter.on('hide', () => {
    hidePanel();
    open = false;
    fixed = false;
    $trigger.classList.remove('opened');
  });

  $trigger.addEventListener('click', () => {
    if (open) {
      if (fixed) {
        emitter.emit('hide');
      } else {
        emitter.emit('fix');
      }
    } else {
      emitter.emit('show');
      emitter.emit('fix');
    }
  });

  $trigger.addEventListener('mouseenter', (e) => {
    if (e.target !== e.currentTarget) return;
    if (open) return;
    emitter.emit('show');
  });

  $contactsBlock.addEventListener('mouseleave', (e) => {
    if (e.target !== e.currentTarget) return;
    if (!open) return;
    if (fixed) return;
    emitter.emit('hide');
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    if (e.target.closest('.header-contacts')) return;
    emitter.emit('hide');
  });

  utils.emitter.on('modal-show', () => {
    if (!open) return;
    emitter.emit('hide');
  });
})();
