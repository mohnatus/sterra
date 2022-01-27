(() => {
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

  $trigger.addEventListener('click', () => {
    if (open) {
      if (fixed) {
        hidePanel();
        open = false;
        fixed = false;
      } else {
        fixed = true;
      }
    } else {
      showPanel();
      open = true;
      fixed = true;
    }
  });

  $trigger.addEventListener('mouseenter', (e) => {
    if (e.target !== e.currentTarget) return;
    if (open) return;
    showPanel();
    open = true;
  });

  $contactsBlock.addEventListener('mouseleave', (e) => {
    if (e.target !== e.currentTarget) return;
    if (!open) return;
    if (fixed) return;
    hidePanel();
    open = false;
  });

  document.addEventListener('click', (e) => {
    if (!open) return;
    if (e.target.closest('.header-contacts')) return;
    hidePanel();
    open = false;
    fixed = false;
  });

  utils.emitter.on('modal-show', () => {
    if (!open) return;
    hidePanel();
    open = false;
    fixed = false;
  });
})();
