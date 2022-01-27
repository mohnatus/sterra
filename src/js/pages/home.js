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
    window.contactForm = utils.validator(contactForm, {
      name: {
        required: {
          message: 'Обязательное поле'
        }
      },
      company: {
        required: {
          message: 'Обязательное поле'
        }
      },
      email: {
        required: {
          message: 'Обязательное поле'
        },
        email: {
          message: 'Некорректный формат'
        }
      },
      phone: {
        required: {
          message: 'Обязательное поле'
        },
        mask: {
          re: /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/,
          message: 'Некорректный формат'
        }
      },
      agreement: {
        required: {
          message: 'Обязательное поле'
        }
      }
    }, {
      parent: '.form-field'
    });
  }
})();
