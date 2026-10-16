const NS = 'http://www.w3.org/2000/svg';

/* menu positions are taken from "Bubbles – type test (1440×900)",
   measured from the centre of that 1440 x 900 frame */
const CIRCLES = [
  { id:'about',  text:'Who am I?',             d:232, mx:-160, my:  24, cx:-72, cy:-32, cd:352 },
  { id:'work',   text:'What did I do?',        d:264, mx:  48, my:-152, cx: 64, cy:-64, cd:384 },
  { id:'values', text:'What do I care about?', d:248, mx: 188, my: 108, cx: 52, cy: 64, cd:368 },
];

const INSET_X = 32, INSET_TOP = 72, PANEL_R = 40;
/* The panel's bottom edge has to clear the footer text. That text wraps to
   two lines on narrower screens, so measure it rather than assume one. */
let INSET_BOTTOM = 60;
function measureFooter() {
  const h = Math.max(
    document.getElementById('e3').offsetHeight,
    document.getElementById('e4').offsetHeight
  );
  INSET_BOTTOM = 28 + h + 12;            // margin below + text + gap above
  document.documentElement.style.setProperty('--inset-bottom', INSET_BOTTOM + 'px');
}

const stencil = document.getElementById('stencil');
const labels  = document.getElementById('labels');
const startEl = document.getElementById('start');
const prompt  = document.getElementById('prompt');
const panel   = document.getElementById('panel');
const edges   = ['e1','e2','e3','e4'].map(id => document.getElementById(id));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let state = 'idle';
let openId = null;

const nodes = CIRCLES.map((c, i) => {
  // a rect whose corner radius is half its height IS a circle, which is how
  // one shape can morph from bubble to the rounded panel
  const el = document.createElementNS(NS, 'rect');
  el.setAttribute('fill', '#fff');
  stencil.appendChild(el);

  const l = document.createElement('button');
  l.className = 'label';
  l.type = 'button';
  l.textContent = c.text;
  l.style.width = l.style.height = c.d + 'px';
  labels.appendChild(l);

  const n = { c, el, l, hover:0, phase:i * 1.7, x:0, y:0, w:0, h:0, r:0 };
  l.addEventListener('click', () => open(c.id));
  l.addEventListener('pointerenter', () => n.hover = 1);
  l.addEventListener('pointerleave', () => n.hover = 0);
  l.addEventListener('focus',        () => n.hover = 1);
  l.addEventListener('blur',         () => n.hover = 0);
  return n;
});

function setState(s) {
  state = s;
  document.body.className = 'state-' + s;
  startEl.classList.toggle('is-gone', s !== 'idle' && s !== 'peek');
  startEl.classList.toggle('is-peeking', s === 'peek');
  labels.classList.toggle('is-on', s === 'menu');
  panel.classList.toggle('is-on', s === 'open');
  edges.forEach(e => e.classList.toggle('is-on', s === 'menu' || s === 'open'));
  if (s === 'open') stencil.removeAttribute('filter');
  else stencil.setAttribute('filter', 'url(#goo)');
}

function open(id) {
  openId = id;
  document.getElementById('panelTitle').textContent = CIRCLES.find(c => c.id === id).text;
  setState('open');
}
const toMenu  = () => { openId = null; setState('menu'); };
const toStart = () => { openId = null; setState('idle'); };

prompt.addEventListener('pointerenter', () => { if (state === 'idle') setState('peek'); });
prompt.addEventListener('pointerleave', () => { if (state === 'peek') setState('idle'); });
startEl.addEventListener('click', () => { if (state === 'idle' || state === 'peek') setState('menu'); });
document.getElementById('panelBack').addEventListener('click', toMenu);

addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    if (state === 'idle' || state === 'peek') { e.preventDefault(); setState('menu'); }
  } else if (e.key === 'Escape') {
    if (state === 'open') toMenu();
    else if (state === 'menu') toStart();
  }
});

let mx = 0, my = 0, hasPointer = false;
addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return;
  hasPointer = true;
  mx = e.clientX - innerWidth / 2;
  my = e.clientY - innerHeight / 2;
});
addEventListener('pointerleave', () => { hasPointer = false; });

const PULL_RANGE = 320, PULL_MAX = 64, DRIFT = 12, EASE = 0.12;
const t0 = performance.now();

function frame(now) {
  const t = (now - t0) / 1000;
  const vw = innerWidth, vh = innerHeight;
  const ox = vw / 2, oy = vh / 2;

  // the expanded panel, straight from the Figma frame
  const pw = vw - INSET_X * 2;
  const ph = vh - INSET_TOP - INSET_BOTTOM;
  const pcy = INSET_TOP + ph / 2 - oy;

  nodes.forEach(n => {
    const { c } = n;
    let tx, ty, tw, th, tr;

    if (state === 'idle') {
      tx = 0; ty = 0; tw = th = 0; tr = 0;
    } else if (state === 'peek') {
      tx = c.cx; ty = c.cy; tw = th = c.cd; tr = c.cd / 2;
    } else if (state === 'open') {
      const chosen = c.id === openId;
      tx = 0; ty = chosen ? pcy : 0;
      tw = chosen ? pw : 0;
      th = chosen ? ph : 0;
      tr = chosen ? PANEL_R : 0;
    } else {
      const grow = 1 + n.hover * 0.06;
      tx = c.mx; ty = c.my; tw = th = c.d * grow; tr = (c.d * grow) / 2;
      if (!reduced) {
        tx += Math.sin(t * 0.42 + n.phase) * DRIFT;
        ty += Math.cos(t * 0.31 + n.phase) * DRIFT;
      }
      if (hasPointer) {
        const vx = mx - c.mx, vy = my - c.my;
        const dd = Math.hypot(vx, vy) || 1;
        if (dd < PULL_RANGE) {
          const pull = (1 - dd / PULL_RANGE) * PULL_MAX;
          tx += (vx / dd) * pull;
          ty += (vy / dd) * pull;
        }
      }
    }

    n.x += (tx - n.x) * EASE;
    n.y += (ty - n.y) * EASE;
    n.w += (tw - n.w) * EASE;
    n.h += (th - n.h) * EASE;
    n.r += (tr - n.r) * EASE;

    /* Added after the easing, not before it, so the wiggle stays crisp
       instead of being smoothed away. It fades in with the blob. */
    let wx = 0, wy = 0, ws = 0;
    if (state === 'peek' && !reduced) {
      const grown = Math.min(1, n.w / c.cd);
      wx = Math.sin(t * 0.90 + n.phase)       * 20 * grown;
      wy = Math.cos(t * 0.70 + n.phase * 1.3) * 16 * grown;
      ws = Math.sin(t * 0.55 + n.phase * 0.7) * 16 * grown;
    }

    const w = Math.max(0, n.w + ws), h = Math.max(0, n.h + ws);
    n.el.setAttribute('x', (ox + n.x + wx - w / 2).toFixed(1));
    n.el.setAttribute('y', (oy + n.y + wy - h / 2).toFixed(1));
    n.el.setAttribute('width',  w.toFixed(1));
    n.el.setAttribute('height', h.toFixed(1));
    n.el.setAttribute('rx', Math.min(n.r, w / 2, h / 2).toFixed(1));

    const s = w / c.d;
    n.l.style.transform =
      `translate(${(ox + n.x - c.d / 2).toFixed(1)}px, ${(oy + n.y - c.d / 2).toFixed(1)}px) scale(${s.toFixed(3)})`;
  });

  requestAnimationFrame(frame);
}

measureFooter();
addEventListener('resize', measureFooter);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureFooter);

setState('idle');
requestAnimationFrame(frame);
