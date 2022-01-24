(() => {
  const isHomePage = document
    .querySelector('.page')
    .classList.contains('home-page');
  if (!isHomePage) return;

  const homeSlider = document.getElementById('home-slider');
  if (homeSlider) {
    fadeSlider(homeSlider);
  }

  const sliders = document.querySelectorAll('.scroll-slider');
  sliders.forEach((s) => {
    scrollSlider(s);
  });
})();
