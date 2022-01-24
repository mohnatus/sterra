(() => {
  const isHomePage = document
    .querySelector('.page')
    .classList.contains('home-page');
  if (!isHomePage) return;

  const slider = document.getElementById('home-slider');
  if (slider) {
    fadeSlider(slider);
  }
})();
