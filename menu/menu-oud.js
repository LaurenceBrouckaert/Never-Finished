/* Menu: gedeeld hamburgermenu voor alle edities.
   Dicht: een bolletje met streepjes. Open: HOME / Editie 1-3 als bolletjes ernaast.
   Gebruik: <script src="../menu/menu.js" defer></script> vlak voor </body>. */
(function () {
  var script = document.currentScript || document.querySelector('script[src*="menu/menu.js"]');
  var base = new URL('./', script.src);          // .../menu/
  var root = new URL('../', base);               // map met alle edities

  var links = [
    { label: 'HOME',     href: new URL('index.html', root).href },
    { label: 'Editie 1', href: new URL('Editie%201/index.html', root).href },
    { label: 'Editie 2', href: new URL('Editie%202/index.html', root).href },
    { label: 'Editie 3', href: new URL('Editie%203/index.html', root).href },
    { label: 'Editie 4', href: new URL('Editie%204/index.html', root).href },
    { label: 'Editie 5', href: new URL('Editie%205/index.html', root).href }
  ];

  var css = '' +
    '#zakmenu,#zakmenu *{box-sizing:border-box}' +
    '#zakmenu{position:fixed;top:max(26px,env(safe-area-inset-top));right:max(27px,env(safe-area-inset-right));' +
      'z-index:2147483000;pointer-events:none;' +
      'font-family:"Bodoni 72","Bodoni 72 Book","Bodoni Moda","Didot",serif;color:#000}' +

    /* bolletje met streepjes */
    '#zakmenu .menu-knop{pointer-events:auto;width:37px;height:37px;margin:0;padding:0;border:0;border-radius:50%;' +
      'background:#e2e2e2;color:#000;cursor:pointer;display:flex;align-items:center;justify-content:center;' +
      '-webkit-tap-highlight-color:transparent;transition:transform .15s ease}' +
    '#zakmenu .menu-knop:hover{transform:scale(1.08)}' +
    '#zakmenu.open .menu-knop{opacity:0;pointer-events:none}' +
    '#zakmenu .menu-knop:focus-visible{outline:1px solid #000;outline-offset:3px}' +
    '#zakmenu .menu-knop span{display:block;width:18px;height:1.5px;background:currentColor;position:relative}' +
    '#zakmenu .menu-knop span::before,#zakmenu .menu-knop span::after{content:"";position:absolute;left:0;width:100%;height:100%;background:currentColor}' +
    '#zakmenu .menu-knop span::before{top:-6px}' +
    '#zakmenu .menu-knop span::after{top:6px}' +

    /* de links */
    '#zakmenu ul{position:absolute;top:0;right:0;list-style:none;margin:0;padding:0;display:flex;flex-direction:column;align-items:center;' +
      'opacity:0;visibility:hidden;transform:translateY(-4px);' +
      'transition:opacity .18s ease,transform .18s ease,visibility 0s linear .18s}' +
    '#zakmenu.open ul{pointer-events:auto;opacity:1;visibility:visible;transform:none;' +
      'transition:opacity .18s ease,transform .18s ease}' +
    '#zakmenu li{margin:0 0 -4px;padding:0}' +
    '#zakmenu li:last-child{margin:0}' +
    '#zakmenu .menu-link{display:flex;align-items:center;justify-content:center;width:81px;height:35px;' +
      'border-radius:17.5px;background:#e2e2e2;color:#000;font-size:16px;line-height:1;white-space:nowrap;' +
      'text-decoration:none;-webkit-tap-highlight-color:transparent}' +
    '#zakmenu .menu-link:hover,#zakmenu .menu-link:focus-visible{outline:none;text-decoration:underline;' +
      'text-underline-offset:.15em;text-decoration-thickness:1px}' +
    '@media (prefers-reduced-motion:reduce){#zakmenu ul,#zakmenu .menu-knop{transition:none}}';

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
    knop.className = 'menu-knop';
    knop.setAttribute('aria-label', 'Menu');
    knop.setAttribute('aria-expanded', 'false');
    knop.innerHTML = '<span></span>';

    var lijst = document.createElement('ul');
    var hier = decodeURIComponent(location.pathname).replace(/\/(index\.html)?$/, '');
    links.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.className = 'menu-link';
      a.href = l.href;
      a.textContent = l.label;
      var doel = decodeURIComponent(new URL(l.href).pathname).replace(/\/(index\.html)?$/, '');
      if (doel === hier) a.setAttribute('aria-current', 'page');
      li.appendChild(a);
      lijst.appendChild(li);
    });

    nav.appendChild(knop);
    nav.appendChild(lijst);
    document.body.appendChild(nav);

    function zet(open) {
      nav.classList.toggle('open', open);
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    // Events niet laten doorlekken naar de pagina (slepen, swipen, klikken op de scène...)
    ['pointerdown', 'mousedown', 'touchstart', 'click', 'wheel'].forEach(function (t) {
      nav.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true });
    });
    knop.addEventListener('click', function (e) {
      zet(true);
      // met het toetsenbord geopend: focus op de eerste link
      if (e.detail === 0) { var eerste = lijst.querySelector('a'); eerste && eerste.focus({ preventScroll: true }); }
    });
    document.addEventListener('pointerdown', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target)) zet(false);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { e.stopPropagation(); zet(false); knop.focus(); }
    }, true);
  }

  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
})();
