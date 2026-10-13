// Preview helpers only. No purchases, redirects or access gates are simulated.
(function () {
  var hostname = window.location.hostname;
  var isLocal = hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]';
  if (!isLocal) return;

  document.documentElement.setAttribute('data-local-preview', '');
  var preview = document.querySelector('.funnel-local-preview');
  if (preview) preview.hidden = false;

})();
