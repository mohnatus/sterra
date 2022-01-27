(() => {
  // PARTS.SUCCESS_MODAL
  window.parts = window.parts || {};
  window.parts.successModal = (() => {
    let $successModal = document.getElementById(
      'success-modal'
    );
    if ($successModal) {
      return components.modal($successModal);
    }
    return null;
  })()

})()
