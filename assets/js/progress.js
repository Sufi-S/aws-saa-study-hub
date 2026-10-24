// Progress tracker using localStorage
var Progress = (function () {
  var STORAGE_KEY = 'saa-progress';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getDomainProgress(domainId) {
    var data = load();
    return data[domainId] || 0;
  }

  function setDomainProgress(domainId, percent) {
    var data = load();
    data[domainId] = Math.min(100, Math.max(0, percent));
    save(data);
  }

  function getOverallProgress() {
    var data = load();
    var weights = { domain1: 30, domain2: 26, domain3: 24, domain4: 20 };
    var total = 0;
    for (var key in weights) {
      total += (data[key] || 0) * (weights[key] / 100);
    }
    return Math.round(total);
  }

  function renderProgressBars() {
    document.querySelectorAll('[data-domain-progress]').forEach(function (el) {
      var domainId = el.getAttribute('data-domain-progress');
      var pct = getDomainProgress(domainId);
      var fill = el.querySelector('.progress-fill');
      var label = el.querySelector('.progress-pct');
      if (fill) fill.style.width = pct + '%';
      if (label) label.textContent = pct + '%';
    });

    var overall = document.querySelector('[data-overall-progress]');
    if (overall) {
      overall.textContent = getOverallProgress() + '%';
    }
  }

  document.addEventListener('DOMContentLoaded', renderProgressBars);

  return {
    get: getDomainProgress,
    set: setDomainProgress,
    overall: getOverallProgress,
    render: renderProgressBars
  };
})();
