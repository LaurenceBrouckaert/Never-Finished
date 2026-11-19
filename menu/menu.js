/* Zak-menu: gedeeld hamburgermenu voor alle edities.
   De knop is de roze fringe-zak; open hangen de links eronder.
   Gebruik: <script src="../menu/menu.js" defer></script> vlak voor </body>. */
(function () {
  var script = document.currentScript || document.querySelector('script[src*="menu/menu.js"]');
  var base = new URL('./', script.src);          // .../menu/
  var root = new URL('../', base);               // map met alle edities

  var links = [
    { label: 'Home',     href: new URL('index.html', root).href },
    { label: 'Editie 1', href: new URL('Editie%201/index.html', root).href },
    { label: 'Editie 2', href: new URL('Editie%202/index.html', root).href },
    { label: 'Editie 3', href: new URL('Editie%203/index.html', root).href }
  ];

  var ROZE = '#ae5b89';
  var css = '' +
    '#zakmenu,#zakmenu *{box-sizing:border-box}' +
    '#zakmenu{--zak-w:max(96px,11vw);' +
      'position:fixed;top:max(8px,1.2vw,env(safe-area-inset-top));right:max(8px,1.2vw,env(safe-area-inset-right));' +
      'z-index:2147483000;pointer-events:none;font-family:"Bodoni 72","Bodoni 72 Book","Bodoni Moda","Didot",serif}' +
    '#zakmenu img{display:block;width:100%;height:auto;-webkit-user-drag:none;user-select:none;-webkit-user-select:none}' +

    /* dichte zak */
    '#zakmenu .zak-knop{pointer-events:auto;display:block;width:var(--zak-w);padding:0;margin:0;border:0;background:none;' +
      'cursor:pointer;-webkit-tap-highlight-color:transparent;transform-origin:50% 0;' +
      'filter:drop-shadow(0 4px 6px rgba(0,0,0,.15));transition:transform .25s ease,opacity .2s ease}' +
    '#zakmenu .zak-knop:hover{transform:rotate(-4deg) scale(1.05)}' +
    '#zakmenu .zak-knop:focus-visible{outline:2px solid #000;outline-offset:4px}' +

    /* open zak */
    '#zakmenu .zak-open{position:absolute;top:0;right:0;width:max-content;' +
      'display:flex;flex-direction:column;align-items:flex-end;' +
      'transform-origin:top right;transform:translateY(-6px);opacity:0;visibility:hidden;' +
      'transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .2s ease,visibility 0s linear .3s}' +
    '#zakmenu.open .zak-open{pointer-events:auto;transform:none;opacity:1;visibility:visible;' +
      'transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .2s ease}' +
    '#zakmenu.open .zak-knop{opacity:0;pointer-events:none;transition:none}' +
    '#zakmenu .zak-groot{width:var(--zak-w);cursor:pointer;filter:drop-shadow(0 8px 12px rgba(0,0,0,.18))}' +
    '#zakmenu ul{list-style:none;margin:4px 0 0;padding:.35em .5em .45em;min-width:calc(var(--zak-w) * .8);background:' + ROZE + ';' +
      'border-radius:.9em;box-shadow:0 8px 14px rgba(0,0,0,.14);text-align:center}' +
    '#zakmenu li{margin:0;padding:0}' +
    '#zakmenu .zak-link{display:block;padding:.2em .4em;font-size:clamp(16px,1.3vw,24px);line-height:1.15;' +
      'color:#e2e2e2;text-decoration:none;-webkit-tap-highlight-color:transparent;transition:opacity .15s}' +
    '#zakmenu .zak-link:hover,#zakmenu .zak-link:focus-visible{outline:none;text-decoration:underline;' +
      'text-underline-offset:.14em;text-decoration-thickness:1px}' +
    '#zakmenu .zak-link[aria-current="page"]{font-style:italic}' +
    '@media (prefers-reduced-motion:reduce){#zakmenu .zak-open,#zakmenu .zak-knop{transition:none}}';

  function build() {
    if (document.getElementById('zakmenu')) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var src = new URL('zak-roze.webp', base).href;

    var nav = document.createElement('nav');
    nav.id = 'zakmenu';
    nav.setAttribute('aria-label', 'Menu');

    var knop = document.createElement('button');
    knop.type = 'button';
    knop.className = 'zak-knop';
    knop.setAttribute('aria-label', 'Menu openen');
    knop.setAttribute('aria-expanded', 'false');
    knop.innerHTML = '<img alt="" draggable="false" src="' + src + '">';

    var paneel = document.createElement('div');
    paneel.className = 'zak-open';
    paneel.innerHTML = '<img class="zak-groot" alt="" draggable="false" src="' + src + '">';

    var lijst = document.createElement('ul');
    var hier = decodeURIComponent(location.pathname).replace(/\/(index\.html)?$/, '');
    links.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'zak-link';
      a.href = l.href;
      a.textContent = l.label;
      var doel = decodeURIComponent(new URL(l.href).pathname).replace(/\/(index\.html)?$/, '');
      if (doel === hier) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      lijst.appendChild(li);
    });
    paneel.appendChild(lijst);

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
    paneel.querySelector('.zak-groot').addEventListener('click', function () { zet(false); knop.focus(); });
    document.addEventListener('pointerdown', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) zet(false);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { e.stopPropagation(); zet(false); knop.focus(); }
    }, true);
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
