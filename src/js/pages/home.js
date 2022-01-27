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
    let validator = utils.validator(
      contactForm,
      {
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
      },
      {
        parent: '.form-field',
        submit: () => {
          contactForm.classList.add('pending');
          utils.submitForm(contactForm, (response) => {
            contactForm.classList.remove('pending');
            if (response.success) {
              if (parts.successModal) {
                parts.successModal.show();
              }
            } else {
              console.error(response);
            }
          });
        }
      }
    );
  }

  function handleSliders(element) {
    if (!element) return;

    let $slider = element.querySelector('.scroll-slider');
    let $slides = [...$slider.querySelectorAll('.scroll-slider-slide')].map((el) => {
      let block = el.querySelector('[data-type]');
      return {
        element: el,
        type: block.dataset.type
      };
    });
    let scrollSlider = $slider.scrollSlider;

    let $filters = [
      ...element.querySelectorAll('.slider-filter')
    ].map((el) => {
      return {
        element: el,
        type: el.dataset.type
      };
    });

    let activeFilter = null;
    function applyFilter(filter) {
      if (activeFilter === filter) return;
      activeFilter = filter;

      $filters.forEach((filter) => {
        filter.element.classList.toggle('active', filter === activeFilter);
      });

      $slides.forEach((slide) => {
        console.log(slide, slide.type, filter.type)
        if (!filter.type || filter.type === slide.type) {
          slide.element.removeAttribute('hidden');
        } else {
          slide.element.setAttribute('hidden', true);
        }
      });
      scrollSlider.update();
    }

    applyFilter($filters[0]);

    $filters.forEach((filter) => {
      filter.element.addEventListener('click', () => {
        applyFilter(filter);
      });
    });
  }

  handleSliders(document.querySelector('.home-solutions'));
  handleSliders(document.querySelector('.home-news'));
})();
