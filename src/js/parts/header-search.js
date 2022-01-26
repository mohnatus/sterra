(() => {
  const $header = document.querySelector('.header');
  if (!$header) return;

  const $headerView = $header.querySelector('.header-view');
  const $searchBlock = document.querySelector('.header-search');

  let $trigger = $searchBlock.querySelector('.header-search__trigger');
  $trigger.addEventListener('click', () => {
    $headerView.classList.add('header-search-opened');
  });

})()
