(() => {
  const $header = document.querySelector('.header');
  if (!$header) return;

  const $toggler = $header.querySelector('.header-toggler');
  const $pane = $header.querySelector('.header-pane');
  if (!$toggler || !$pane) return;

  const $headerView = $header.querySelector('.header-view');
  const $paneMask = $pane.querySelector('.header-pane__mask');

  let isLargeScreen = false;
  utils.addMediaQueryListener('(min-width: 1280px)', (state) => {
    isLargeScreen = state;
    if (state) {
      closePane();
    }
  });

  function openPane() {
    if (isLargeScreen) return;
    let scrollbarWidth = utils.getScrollbarWidth();
    $pane.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    $toggler.removeAttribute('data-closed');
    $headerView.style.paddingRight = scrollbarWidth + 'px';
    $headerView.classList.add('header-pane-opened')
  }
  function closePane() {
    $pane.setAttribute('hidden', true);
    document.body.style.overflow = '';
    $toggler.setAttribute('data-closed', true);
    $headerView.style.paddingRight = '';
    $headerView.classList.remove('header-pane-opened')
  }
  function togglePane() {
    let isHidden = $pane.hasAttribute('hidden');
    if (isHidden) openPane();
    else closePane();
  }

  $toggler.addEventListener('click', () => {
    togglePane();
  });
  if ($paneMask) {
    $paneMask.addEventListener('click', () => {
      closePane();
    });
  }

  utils.emitter.on('modal-show', () => {
    closePane();
  });
})();
