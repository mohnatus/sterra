(() => {
  const events = {
    touch: 'form-validator-touch',
    changeStatus: 'form-validator-change-status'
  };

  const REQUIRED = 'required';
  const EMAIL = 'email';
  const MASK = 'mask';

  const EMAIL_RE =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  function validateInput(field, rules = {}) {
    let isValid = true;
    let error = '';

    let value = field.value;

    Object.entries(rules).forEach(([ruleName, rule]) => {
      if (!isValid) return;

      switch (ruleName) {
        case REQUIRED:
          if (!value) {
            isValid = false;
            error = rule.message;
          }
          break;
        case EMAIL:
          if (value) {
            let isEmail = EMAIL_RE.test(value);
            if (!isEmail) {
              isValid = false;
              error = rule.message;
            }
          }
          break;
        case MASK:
          if (value) {
            let re = rule.re;
            let isCorrect = re.test(value);
            if (!isCorrect) {
              isValid = false;
              error = rule.message;
            }
          }
          break;
      }
    });

    return { isValid, error };
  }

  function validateCheckbox(field, rules = {}) {
    let isValid = true;
    let error = '';

    let checked = field.checked;

    Object.entries(rules).forEach(([ruleName, rule]) => {
      switch (ruleName) {
        case REQUIRED:
          if (!checked) {
            isValid = false;
            error = rule.message;
          }
          break;
      }
    });

    return { isValid, error };
  }

  function createError() {
    let el = document.createElement('div');
    el.classList.add('form-error');
    return el;
  }

  

  function validator(form, rules, config = {}) {
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

        let parent = config && config.parent && field.closest(config.parent);
        if (!parent) parent = field.parentElement;

        let fieldData = {
          name: fieldName,
          element: field,
          parent,
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
              fieldData.$error.remove();
            }
            fieldData.element.classList.remove('invalid');
          } else {
            if (!fieldData.$error) {
              fieldData.$error = createError();
            }
            fieldData.$error.textContent = fieldData.errorText;

            fieldData.parent.appendChild(fieldData.$error);

            fieldData.element.classList.add('invalid');
          }
        }

        function onChange(touch) {
          if (touch && !fieldData.touched) {
            fieldData.touched = true;
            emitter.emit(events.touch);
          }

          let { error, isValid } = fieldData.validator(field, fieldRules);
          fieldData.errorText = error;
          fieldData.isValid = isValid;

          setError();

          emitter.emit(events.changeStatus);
        }

        onChange();

        field.addEventListener('change', () => onChange(true));
        field.addEventListener('input', () => onChange(true));

        fieldData.setError = setError;
        return fieldData;
      })
      .filter(Boolean);

    emitter.on(events.changeStatus, () => {
      let hasInvalidFields = fields.some((f) => !f.isValid);
      if (hasInvalidFields) {
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
        config && config.submit();
      }
    });

    return {
      fields
    };
  }

  window.utils = window.utils || {};
  window.utils.validator = validator;
})();
