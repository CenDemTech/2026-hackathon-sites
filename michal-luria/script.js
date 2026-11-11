// Tabs: shows one section at a time based on the address (#research, #writing, ...).
// Without JavaScript every section simply shows, one after another.
(function () {
  var tabs = ['home', 'research', 'writing', 'advising'];

  function show() {
    var id = location.hash.replace('#', '');
    if (tabs.indexOf(id) === -1) id = 'home';
    tabs.forEach(function (t) {
      document.getElementById(t).hidden = t !== id;
      var link = document.querySelector('nav a[href="#' + t + '"]');
      if (t === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('hashchange', function () {
    show();
    window.scrollTo(0, 0);
  });
  show();
})();
