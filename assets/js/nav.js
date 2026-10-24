// Mobile nav toggle + active link highlighting
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active nav link
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;

    // Normalize: resolve relative href to absolute
    var linkPath = new URL(href, window.location.origin + path).pathname;

    if (path === linkPath || (linkPath !== '/' && path.startsWith(linkPath.replace(/\/[^/]*$/, '')))) {
      a.classList.add('active');
    }
  });
});
