(() => {
  // PAGES.HOME_PAGE
  let page = document.querySelector('.page');
  if (!page) return;

  let main = page.querySelector('.page-main');
  if (!main) return;

  const isHomePage = main.classList.contains('home-page');
  if (!isHomePage) return;

  const homeSlider = document.getElementById('home-slider');
  if (homeSlider) {
    components.fadeSlider(homeSlider);
  }

  const clientsSlider = document.getElementById('clients-slider');
  if (clientsSlider) {
    components.infiniteSlider(clientsSlider, {
      slides: 2,
      offset: 10,
      breakpoints: {
        768: {
          slides: 3,
          center: true
        },
        1024: {
          slides: 4,
          center: true
        },
        1280: {
          slides: 6,
          center: true
        }
      }
    });
  }

  const solutionsSlider = document.getElementById('solutions-slider');
  if (solutionsSlider) {
    components.infiniteSlider(solutionsSlider, {
      slides: 1,
      offset: 10,
      breakpoints: {
        768: {
          slides: 2,
          center: true
        },
        1280: {
          slides: 3,
          center: true
        }
      }
    });
  }

  const casesSlider = document.getElementById('cases-slider');
  if (casesSlider) {
    components.infiniteSlider(casesSlider, {
      slides: 1,
      offset: 10,
      breakpoints: {
        768: {
          slides: 2,
          center: true
        },
        1280: {
          slides: 3,
          center: true
        }
      }
    });
  }


  const newsSlider = document.getElementById('news-slider');
  if (newsSlider) {
    components.infiniteSlider(newsSlider, {
      slides: 1,
      offset: 10,
      breakpoints: {
        768: {
          slides: 2,
          center: true
        },
        1024: {
          slides: 3,
          center: true,
        },
        1280: {
          slides: 4,
          center: true
        }
      }
    });
  }

  // const sliders = document.querySelectorAll('.scroll-slider');
  // sliders.forEach((s) => {
  //   if (s.id === 'clients-slider') {
  //   } else components.scrollSlider(s);
  // });

  const faq = document.getElementById('home-faq');
  if (faq) {
    components.accordion(faq);
  }

  const contactForm = document.getElementById('home-contact-form');
  if (contactForm) {
    let $submit = contactForm.querySelector('[type="submit"]');
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
            message: 'Согласие на обработку своих персональных данных обязательно для обратной связи'
          }
        }
      },
      {
        parent: '.form-field',
        submit: () => {
          contactForm.classList.add('pending');
          if ($submit) $submit.disabled = true;
          utils.submitForm(contactForm, (response) => {
            contactForm.classList.remove('pending');
            if ($submit) $submit.disabled = false;
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
    let $slides = [...$slider.querySelectorAll('.scroll-slider-slide')].map(
      (el) => {
        let block = el.querySelector('[data-type]');
        return {
          element: el,
          type: block.dataset.type
        };
      }
    );
    let scrollSlider = $slider.infiniteSlider;

    let $filters = [...element.querySelectorAll('.slider-filter')].map((el) => {
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
