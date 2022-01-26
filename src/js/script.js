document.documentElement.style.setProperty(
  '--scrollbar-width',
  utils.getScrollbarWidth() + 'px'
);

window.addEventListener(
  'resize',
  () => {
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      utils.getScrollbarWidth() + 'px'
    );
  },
  { passive: true }
);
