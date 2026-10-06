/* Hub: routing for the “about” page + offline support */
(() => {
  const route = () => {
    const about = location.hash === '#about';
    document.getElementById('home').classList.toggle('hidden', about);
    document.getElementById('about').classList.toggle('hidden', !about);
    if (about) window.scrollTo(0, 0);
  };
  window.addEventListener('hashchange', route);
  route();
  window.CMV.registerSW();
})();
