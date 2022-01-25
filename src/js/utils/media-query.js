(() => {
  function addMediaQueryListener(query, cb) {
    const mqList = window.matchMedia(query);
    cb(mqList.matches);

    function check(e) {
      cb(e.matches);
    }

    mqList.addEventListener('change', check);
  }

  window.addMediaQueryListener = addMediaQueryListener;
})();
