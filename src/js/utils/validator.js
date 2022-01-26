(() => {
  const events = {
    touch: 'form-validator-touch',
    changeStatus: 'form-validator-change-status'
  };

  function validateInput(field, rules) {
    return { isValid: true, error: '' };
  }

  function validateCheckbox(field, rules) {
    return { isValid: true, error: '' };
  }

  function validator(form, rules) {
    const emitter = utils.createEmitter();
    let submitted = false;

    const $submitButton = form.querySelector('[type="submit"]');
    $submitButton.classList.add('disabled');

    let fields = Object.entries(rules)
      .map(([fieldName, fieldRules]) => {
        let field = form.elements[fieldName];
        if (!field) return;

        let validator;

        if (field.tagName === 'TEXTAREA') {
          validator = validateInput;
        } else if (field.type === 'checkbox') {
          validator = validateCheckbox;
        } else if (field.type === 'text') {
          validator = validateInput;
        }

        if (!validator) return;

        let fieldData = {
          name: fieldName,
          element: field,
          type: field.type,
          rules: fieldRules,
          touched: false,
          errorText: false,
          validator,
          $error: null
        };

        function setError() {
          if (!submitted || fieldData.isValid) {
            if (fieldData.$error) {
              fieldData.$error.detach();
            }
            fieldData.element.classList.remove('invalid');
          } else {
            if (!fieldData.$error) {
              fieldData.$error = document.createElement('div');
              fieldData.$error.addClass('form-error');
            }
            fieldData.$error.textContent = fieldData.errorText;
            fieldData.element.parentElement.insertBefore(
              fieldData.$error,
              fieldData.element.nextElementSibling
            );
            fieldData.element.classList.add('invalid');
          }
        }

        function onChange() {
          if (!fieldData.touched) {
            fieldData.touched = true;
            emitter.emit(events.touch);
          }

          let { error, isValid } = fieldData.validator(field, fieldRules);
          fieldData.errorText = error;
          fieldData.isValid = isValid;

          setError();

          emitter.emit(events.changeStatus);
        }

        field.addEventListener('change', onChange);
        field.addEventListener('input', onChange);

        return {
          ...fieldData,
          setError
        };
      })
      .filter(Boolean);

    emitter.on(events.changeStatus, () => {
      let hasInvalidFields = fields.some((f) => !f.isValid);
      console.log('changestatus', hasInvalidFields, submitted);
      if (!hasInvalidFields) {
        if (submitted) {
          $submitButton.disabled = true;
        } else {
          $submitButton.classList.add('disabled');
        }
      } else {
        $submitButton.disabled = false;
        $submitButton.classList.remove('disabled');
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!submitted) {
        submitted = true;
        fields.forEach((f) => f.setError());
      }
      let hasInvalidFields = fields.some((f) => !f.isValid);
      if (!hasInvalidFields) {
        form.submit();
      }
    });
  }

  window.utils = window.utils || {};
  window.utils.validator = validator;
})();
