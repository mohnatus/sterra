(() => {
  const selectors = {
    field: '[data-field]',
    reset: '[data-reset]',
    list: '[data-list]'
  };

  const MIN_LENGTH = 2;
  let id = 1;

  function autocomplete(el) {
    const $field = el.querySelector(selectors.field);
    const $reset = el.querySelector(selectors.reset);
    const $list = el.querySelector(selectors.list);

    if (!$field || !$list) return;

    let action = el.action;
    let method = el.method;

    let actualId = null;

    function updateList(items) {
      if (!items.length) {
        let el = document.createElement('div');
        el.textContent('Ничего не найдено');
        $list.innerHTML = '';
        $list.appendChild(el);
        return;
      }
      let fragment = document.createDocumentFragment();
      items.forEach((item) => {
        let el = document.createElement('div');
        el.textContent = item.text;
        fragment.appendChild(el);
      });
      $list.innerHTML = '';
      $list.appendChild(fragment);
    }

    function showList() {
      $list.removeAttribute('hidden');
    }

    function hideList() {
      $list.setAttribute('hidden', true);
    }

    function loadOptions(q) {
      let requestId = id++;
      actualId = requestId;

      return fetch(action + `?q=${q}`, {
        method
      })
        .then((res) => {
          if (requestId === actualId) return res.json();
          throw new Error({
            error: 'The request is irrelevant',
            requestId
          });
        })
        .then((res) => res.items);
    }

    function resetList() {
      hideList();
      actualId = null;
      updateList([]);
    }

    const onInput = utils.debounce(() => {
      let value = $field.value;
      if (value.length < MIN_LENGTH) {
        resetList();
        return;
      }
      loadOptions(value)
        .then((items) => {
          updateList(items);
          showList();
        })
        .catch(({ error, requestId }) => {
          console.log(error, requestId);
        });
    }, 500);

    $field.addEventListener('input', onInput);
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      onInput();
    });

    if ($reset) {
      $reset.addEventListener('click', () => {
        $field.value = '';
        resetList();
      });
    }
  }

  window.components = window.components || {};
  window.components.autocomplete = autocomplete;

  document.querySelectorAll('[data-search]').forEach((el) => autocomplete(el));
})();