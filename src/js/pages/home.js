(() => {
  const isHomePage = document
    .querySelector('.page')
    .classList.contains('home-page');
  if (!isHomePage) return;

  const homeSlider = document.getElementById('home-slider');
  if (homeSlider) {
    components.fadeSlider(homeSlider);
  }

  const sliders = document.querySelectorAll('.scroll-slider');
  sliders.forEach((s) => {
    components.scrollSlider(s);
  });

  const faq = document.getElementById('home-faq');
  if (faq) {
    components.accordion(faq);
  }

  const contactForm = document.getElementById('home-contact-form');
  if (contactForm) {
    utils.validator(contactForm, {
      name: {
        required: {
          
        }
      }
    })
  }
})();
