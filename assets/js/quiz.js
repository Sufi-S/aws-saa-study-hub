// Quiz engine — loads questions from /data/questions.json
var Quiz = (function () {
  var questions = [];
  var current = 0;
  var score = 0;
  var container = null;

  function loadQuestions(domain) {
    var basePath = getBasePath();
    return fetch(basePath + 'data/questions.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (domain) {
          questions = data.filter(function (q) { return q.domain === domain; });
        } else {
          questions = data;
        }
        return questions;
      });
  }

  function getBasePath() {
    var path = window.location.pathname;
    if (path.includes('/domains/') || path.includes('/interview/')) {
      return '../';
    }
    return '';
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function init(containerEl, domain) {
    container = containerEl;
    current = 0;
    score = 0;
    return loadQuestions(domain).then(function () {
      if (questions.length === 0) {
        container.innerHTML = '<div class="content-placeholder"><h3>No questions yet</h3><p>Questions will be added soon.</p></div>';
        return;
      }
      shuffle(questions);
      renderQuestion();
    });
  }

  function renderQuestion() {
    if (!container || current >= questions.length) {
      renderResults();
      return;
    }
    var q = questions[current];
    var html = '<div class="quiz-question">';
    html += '<div class="quiz-counter">Question ' + (current + 1) + ' of ' + questions.length + '</div>';
    html += '<h3>' + escapeHtml(q.question) + '</h3>';
    html += '<div class="quiz-options">';
    q.options.forEach(function (opt, i) {
      html += '<button class="quiz-option" data-index="' + i + '">';
      html += '<span class="quiz-option-letter">' + String.fromCharCode(65 + i) + '</span>';
      html += '<span>' + escapeHtml(opt) + '</span>';
      html += '</button>';
    });
    html += '</div></div>';
    container.innerHTML = html;

    container.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () { selectAnswer(parseInt(btn.dataset.index)); });
    });
  }

  function selectAnswer(index) {
    var q = questions[current];
    var correct = q.correctAnswer;
    var buttons = container.querySelectorAll('.quiz-option');

    buttons.forEach(function (btn) {
      btn.disabled = true;
      var idx = parseInt(btn.dataset.index);
      if (idx === correct) btn.classList.add('correct');
      if (idx === index && idx !== correct) btn.classList.add('wrong');
    });

    if (index === correct) score++;

    var explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.innerHTML = '<strong>Explanation:</strong> ' + escapeHtml(q.explanation || 'No explanation provided.');
    container.querySelector('.quiz-question').appendChild(explanation);

    var nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = current < questions.length - 1 ? 'Next Question' : 'See Results';
    nextBtn.addEventListener('click', function () {
      current++;
      renderQuestion();
    });
    container.querySelector('.quiz-question').appendChild(nextBtn);
  }

  function renderResults() {
    var pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    container.innerHTML =
      '<div class="quiz-results">' +
      '<h3>Quiz Complete</h3>' +
      '<div class="quiz-score">' + score + '/' + questions.length + ' (' + pct + '%)</div>' +
      '<button class="quiz-next-btn" onclick="location.reload()">Try Again</button>' +
      '</div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { init: init };
})();
