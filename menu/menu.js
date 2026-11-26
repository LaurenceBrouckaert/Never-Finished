/* Kruisje: gedeeld voor alle edities, brengt je terug naar de homepagina.
   Gebruik: <script src="../menu/menu.js" defer></script> vlak voor </body>.
   (Het vroegere hamburgermenu staat in menu-oud.js) */
(function () {
  var script = document.currentScript || document.querySelector('script[src*="menu/menu.js"]');
  var base = new URL('./', script.src);          // .../menu/
  var home = new URL('../index.html', base).href;

  var css = '' +
    '#zakmenu{position:fixed;top:max(26px,env(safe-area-inset-top));right:max(27px,env(safe-area-inset-right));' +
      'z-index:2147483000;box-sizing:border-box;width:37px;height:37px;border-radius:50%;' +
      'background:#e2e2e2;color:#000;display:flex;align-items:center;justify-content:center;' +
      'text-decoration:none;-webkit-tap-highlight-color:transparent;transition:transform .15s ease}' +
    '#zakmenu:hover{transform:scale(1.08)}' +
    '#zakmenu:focus-visible{outline:1px solid #000;outline-offset:3px}' +
    '#zakmenu span{position:relative;display:block;width:18px;height:18px}' +
    '#zakmenu span::before,#zakmenu span::after{content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;' +
      'margin-top:-.75px;background:currentColor}' +
    '#zakmenu span::before{transform:rotate(45deg)}' +
    '#zakmenu span::after{transform:rotate(-45deg)}' +
    '@media (prefers-reduced-motion:reduce){#zakmenu{transition:none}}';

  function build() {
    if (document.getElementById('zakmenu')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var a = document.createElement('a');
    a.id = 'zakmenu';
    a.href = home;
    a.setAttribute('aria-label', 'Terug naar home');
    a.innerHTML = '<span aria-hidden="true"></span>';
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
