(() => {
  const $questionModal = document.getElementById('question');
  if (!$questionModal) return;

  const modal = components.modal($questionModal);
  const triggers = document.querySelectorAll('[data-ask-question]');
  triggers.forEach((el) => {
    el.addEventListener('click', () => modal.show());
  });

  window.parts = window.parts || {};
  window.parts.questionModal = modal;
})();
