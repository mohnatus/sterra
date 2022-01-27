(() => {
  // UTILS.CREATE_EMITTER
  function createEmitter() {
    const cbs = {};

    function addEventCb(eventName, cb) {
      if (!(eventName in cbs)) cbs[eventName] = [];
      cbs[eventName].push(cb);
    }

    function removeEventCb(eventName, cb) {
      if (!(eventName in cbs)) return;
      if (!cb) cbs[eventName] = [];
      else cbs[eventName] = cbs[eventName].filter((_cb) => cb === cb);
    }

    function on(eventName, cb) {
      if (Array.isArray(eventName)) {
        eventName.forEach((e) => {
          addEventCb(e, cb);
        });
      } else {
        addEventCb(eventName, cb);
      }
    }

    function off(eventName, cb) {
      if (Array.isArray(eventName)) {
        eventName.forEach((e) => removeEventCb(e, cb));
      } else {
        removeEventCb(eventName, cb);
      }
    }

    function emit(eventName, data) {
      if (!(eventName in cbs)) return;
      let eventCbs = cbs[eventName];
      if (!Array.isArray(eventCbs) || !eventCbs.length) return;
      eventCbs.forEach((cb) => cb(data));
    }

    return {
      on,
      off,
      emit
    };
  }

  window.utils = window.utils || {};
  window.utils.createEmitter = createEmitter;

  window.utils.emitter = createEmitter();
})();
