// Год в футере (если элемент существует)
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    var targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // закрыть меню на мобиле
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Мобильное меню
var navToggle = document.querySelector('.nav-toggle');
var siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Простой лайтбокс для галереи
(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  var lightboxImg = lightbox.querySelector('.lightbox-image');
  var lightboxCaption = lightbox.querySelector('.lightbox-caption');
  var closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('[data-gallery] a').forEach(function (item) {
    item.addEventListener('click', function (e) {
      var href = item.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      lightboxImg.src = href;
      if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    if (lightboxCaption) lightboxCaption.textContent = '';
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();

// Открытие лайтбокса по имени тренера
var coachName = document.querySelector('.hero .name');
if (coachName) {
  coachName.style.cursor = 'pointer';
  var openCoach = function () {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var lightboxImg = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    lightboxImg.src = 'foto/Ozyumenko_Viktor_Vladimirovich.jpg';
    if (lightboxCaption) lightboxCaption.textContent = 'Чёрный пояс, 3 дан. Судья первой категории';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  coachName.addEventListener('click', openCoach);
}

// Подсветка ближайшего соревнования по дате
(function () {
  var eventsTable = document.querySelector('#events .table tbody');
  if (!eventsTable) return;
  var monthMap = {
    'сент.': 9, 'окт.': 10, 'нояб.': 11, 'дек.': 12,
    'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12
  };
  var today = new Date();
  var parseDate = function (text) {
    // примеры: "20–21 сент.", "6–7 дек.", "12–15 декабря"
    var m = text.trim().match(/(\d{1,2})(?:[–-]\d{1,2})?\s*(сент\.|окт\.|нояб\.|дек\.|сентября|октября|ноября|декабря)/i);
    if (!m) return null;
    var day = parseInt(m[1], 10);
    var monthKey = m[2].toLowerCase();
    var month = monthMap[monthKey];
    if (!month) return null;
    var year = today.getFullYear();
    var dt = new Date(year, month - 1, day);
    // если дата уже прошла более чем на 15 дней, сдвигаем на следующий год (на случай конца года)
    if (dt < today && (today - dt) / 86400000 > 15) dt.setFullYear(year + 1);
    return dt;
  };

  var rows = Array.prototype.slice.call(eventsTable.querySelectorAll('tr'));
  var upcoming = rows
    .map(function (tr) {
      var dateCell = tr.cells[0];
      var dateText = dateCell ? dateCell.textContent : '';
      var when = parseDate(dateText);
      return when ? { tr: tr, when: when } : null;
    })
    .filter(Boolean)
    .filter(function (item) { return item.when >= new Date(today.getFullYear(), today.getMonth(), today.getDate()); })
    .sort(function (a, b) { return a.when - b.when; });

  if (upcoming.length > 0) {
    var next = upcoming[0].tr;
    next.classList.add('next-event');
  }
})();

// Открытие фото пояса по клику на "чёрный пояс, 3 дан"
(function(){
  var belt = document.querySelector('.belt-link');
  if (!belt) return;
  belt.addEventListener('click', function(){
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var lightboxImg = lightbox.querySelector('.lightbox-image');
    var lightboxCaption = lightbox.querySelector('.lightbox-caption');
    lightboxImg.src = 'foto/poyas_kudo.jpeg';
    if (lightboxCaption) lightboxCaption.textContent = 'Чёрный пояс, 3 дан';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
})();


