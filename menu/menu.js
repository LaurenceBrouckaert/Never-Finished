/* Zak-menu: gedeeld hamburgermenu voor alle edities.
   Gebruik: <script src="../menu/menu.js" defer></script> vlak voor </body>. */
(function () {
  var script = document.currentScript || document.querySelector('script[src*="menu/menu.js"]');
  var base = new URL('./', script.src);          // .../menu/
  var root = new URL('../', base);               // map met alle edities

  var links = [
    { label: 'HOME',     href: new URL('index.html', root).href,            top: 33.5 },
    { label: 'Editie 1', href: new URL('Editie%201/index.html', root).href, top: 50.5 },
    { label: 'Editie 2', href: new URL('Editie%202/index.html', root).href, top: 66.5 },
    { label: 'Editie 3', href: new URL('Editie%203/index.html', root).href, top: 82.5 }
  ];

  var css = '' +
    '#zakmenu,#zakmenu *{box-sizing:border-box}' +
    '#zakmenu{--zak-w:max(32px,6.3vw);' +
      'position:fixed;top:max(10px,2.25vw,env(safe-area-inset-top));right:max(10px,2.4vw,env(safe-area-inset-right));' +
      'z-index:2147483000;pointer-events:none}' +
    '#zakmenu .zak-knop{pointer-events:auto;display:block;width:var(--zak-w);padding:0;margin:0;border:0;background:none;' +
      'cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .2s ease,opacity .2s ease}' +
    '#zakmenu .zak-knop:hover{transform:scale(1.06) rotate(-2deg)}' +
    '#zakmenu .zak-knop:focus-visible{outline:2px solid #000;outline-offset:4px}' +
    '#zakmenu img{display:block;width:100%;height:auto;-webkit-user-drag:none;user-select:none;-webkit-user-select:none}' +
    '#zakmenu .zak-open{position:absolute;top:-0.6vw;right:-0.2vw;width:min(max(110px,7.6vw),calc((100dvh - 40px) * 930 / 1503));' +
      'transform-origin:top right;transform:scale(.25);opacity:0;visibility:hidden;' +
      'transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .2s ease,visibility 0s linear .28s;cursor:pointer}' +
    '#zakmenu.open .zak-open{pointer-events:auto;transform:none;opacity:1;visibility:visible;transition:transform .28s cubic-bezier(.2,.8,.2,1),opacity .2s ease}' +
    '#zakmenu.open .zak-knop{opacity:0;pointer-events:none}' +
    '#zakmenu .zak-link{position:absolute;left:12%;width:68%;height:15%;border-radius:999px;' +
      'font-size:0;color:transparent;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:background .15s}' +
    '#zakmenu .zak-link:hover,#zakmenu .zak-link:focus-visible{background:rgba(0,0,0,.08);outline:none}';

  function build() {
    if (document.getElementById('zakmenu')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var nav = document.createElement('nav');
    nav.id = 'zakmenu';
    nav.setAttribute('aria-label', 'Menu');

    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'zak-knop';
    knop.setAttribute('aria-label', 'Menu openen');
    knop.setAttribute('aria-expanded', 'false');
    knop.innerHTML = '<img alt="" draggable="false" src="' + new URL('zak.png', base).href + '">';

    var paneel = document.createElement('div');
    paneel.className = 'zak-open';
    paneel.innerHTML = '<img alt="" draggable="false" src="' + new URL('zak-menu.png', base).href + '">';

    var hier = decodeURIComponent(location.pathname).replace(/\/(index\.html)?$/, '');
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'zak-link';
      a.href = l.href;
      a.textContent = l.label;
      a.style.top = l.top + '%';
      var doel = decodeURIComponent(new URL(l.href).pathname).replace(/\/(index\.html)?$/, '');
      if (doel === hier) a.setAttribute('aria-current', 'page');
      paneel.appendChild(a);
    });

    nav.appendChild(knop);
    nav.appendChild(paneel);
    document.body.appendChild(nav);

    function zet(open) {
      nav.classList.toggle('open', open);
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var eerste = paneel.querySelector('a'); eerste && eerste.focus({ preventScroll: true }); }
    }
    // Events niet laten doorlekken naar de pagina (slepen, swipen, klikken op de scène...)
    ['pointerdown', 'mousedown', 'touchstart', 'click', 'wheel'].forEach(function (t) {
      nav.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });
    knop.addEventListener('click', function () { zet(true); });
    paneel.addEventListener('click', function (e) { if (!e.target.closest('a')) zet(false); });
    document.addEventListener('pointerdown', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) zet(false);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { e.stopPropagation(); zet(false); knop.focus(); }
    }, true);
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
