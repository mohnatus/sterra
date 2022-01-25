(() => {
  const $header = document.querySelector('.header');

  if (!$header) return;

  document.addEventListener(
    'scroll',
    (e) => {
      $header.classList.toggle(
        'fixed',
        document.documentElement.scrollTop > 10
      );
    },
    { passive: true }
  );


})();
