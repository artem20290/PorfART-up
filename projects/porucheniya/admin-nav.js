/** Навигация «Доска | Администратор» отключена. */
(function () {
  var existing = document.getElementById("poru-board-nav");
  if (existing) existing.remove();
  document.querySelectorAll('link[href*="admin-nav.css"]').forEach(function (el) {
    el.remove();
  });
})();
