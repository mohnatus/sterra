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

  const $menu = document.querySelector('.header-menu');
  if ($menu) {
    const $menuSections = $menu.querySelectorAll('.header-menu-section');

    $menuSections.forEach($section => {
      let $toggler = $section.querySelector('.header-menu-section__toggler');
      if (!$toggler) return;
      let $sectionList = $section.querySelector('.header-menu-section__items');
      if (!$sectionList) return;

      let list = utils.collapsible($sectionList, 400);

      $toggler.addEventListener('click', () => {
        list.toggle();
      })
    })
  }

  
})();
