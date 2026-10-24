// Click-to-reveal for practice question answers
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.reveal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = btn.nextElementSibling;
      if (!answer) return;
      var showing = answer.classList.contains('show');
      answer.classList.toggle('show');
      btn.textContent = showing ? 'Show Answer' : 'Hide Answer';
    });
  });
});
