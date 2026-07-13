(function () {
  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  document.querySelectorAll('[data-report-date]').forEach(function (el) {
    var report = new Date(el.getAttribute('data-report-date') + 'T00:00:00');
    var fixedAttr = el.getAttribute('data-fixed-date');
    var end = fixedAttr ? new Date(fixedAttr + 'T00:00:00') : new Date();
    var days = Math.max(0, Math.floor((end - report) / 86400000));

    if (el.classList.contains('disclosure-chip')) {
      el.textContent = fixedAttr
        ? 'PATCHED IN ' + days + ' DAYS'
        : 'UNPATCHED · ' + days + ' DAYS';
      el.classList.add(fixedAttr ? 'disclosure-chip-fixed' : 'disclosure-chip-open');
      return;
    }

    var daysEl = el.querySelector('.disclosure-days');
    if (daysEl) daysEl.textContent = days;
    el.querySelectorAll('.disclosure-date').forEach(function (dateEl) {
      dateEl.textContent = formatDate(dateEl.getAttribute('data-date'));
    });
  });
})();
