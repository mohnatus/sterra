(() => {
  let cbs = window.delayedScripts || [];
  cbs.forEach((cb) => cb());
})();
