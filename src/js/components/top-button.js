(() => {
  let $topButtonContainer = document.querySelector('.top-button');
  if (!$topButtonContainer) return;

  let $topButton = $topButtonContainer.querySelector('button');
  if (!$topButton) return;

  const SCROLL_LIMIT = 200;

  function hideButton() {
    $topButton.setAttribute('hidden', true);
  }

  function showButton() {
    $topButton.removeAttribute('hidden');
  }

  function toTop() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  $topButton.addEventListener('click', () => toTop());

  window.addEventListener(
    'scroll',
    () => {
      let scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll > SCROLL_LIMIT) {
        showButton();
      } else {
        hideButton();
      }
    },
    { passive: true }
  );
})();
