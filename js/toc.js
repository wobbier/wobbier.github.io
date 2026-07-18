// Builds the "On this page" rail from the article's section headings and
// highlights the active one as you scroll. No-ops (and hides the nav) when
// a post has no sections.
(function () {
  var main = document.querySelector('.article-main');
  var list = document.querySelector('.toc-list');
  var nav = document.querySelector('.rail-toc');
  if (!main || !list) return;

  var heads = main.querySelectorAll('.section-title > h1, .section-title > h2');
  if (!heads.length) {
    if (nav) nav.style.display = 'none';
    return;
  }

  function slug(text, i) {
    return 'section-' + (i + 1) + '-' +
      text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  var byId = {};
  heads.forEach(function (h, i) {
    var text = (h.getAttribute('aria-label') || h.textContent || '').trim();
    if (!h.id) h.id = slug(text, i);

    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = text;

    var li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
    byId[h.id] = a;
  });

  // Scroll spy. The active section is the last heading scrolled above the
  // header line. Special-cased at the page bottom so the final (often short)
  // section still lights up even when the page can't scroll its heading to
  // the top — the flaw an IntersectionObserver band has with the last item.
  var OFFSET = 140; // header height + a little breathing room
  var activeLink = null;

  function setActive(link) {
    if (link === activeLink) return;
    if (activeLink) activeLink.classList.remove('active');
    activeLink = link;
    if (activeLink) activeLink.classList.add('active');
  }

  function updateActive() {
    var doc = document.documentElement;
    var atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
    var currentId = null;

    if (atBottom) {
      currentId = heads[heads.length - 1].id;
    } else {
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top <= OFFSET) currentId = heads[i].id;
        else break;
      }
    }

    setActive(currentId ? byId[currentId] : null);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateActive(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Section ids are created above at runtime, so the browser's initial jump
  // to a "#section" URL missed them. Re-run it now (respects scroll-margin).
  if (window.location.hash) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  updateActive();
})();
