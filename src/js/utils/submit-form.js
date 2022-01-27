(() => {
  function submitForm(form, cb) {
    let formData = new FormData(form);
    let method = form.method;

    if (method.toUpperCase() === 'GET') {
      let params = new URLSearchParams(formData).toString();
      fetch(form.action + '?' + params)
        .then((res) => res.json())
        .then((data) => cb(data));
    } else {
      fetch(form.action, {
        method,
        body: formData
      })
        .then((res) => res.json())
        .then((data) => cb(data));
    }
  }

  window.utils = window.utils || {};
  window.utils.submitForm = submitForm;
})();
