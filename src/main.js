/* Fiona Szeto — portfolio
   One non-scrolling stage with three layers of state:

   start   the title, with an organic window that opens on hover
   home    the window has swallowed the screen; the menu takes over
   view    a panel over the room — a page, or a case study read as chapters
*/

import { PROJECTS, PAGES } from './content.js';

const stage  = document.getElementById('stage');
const start  = document.getElementById('start');
const home   = document.getElementById('home');
const prompt = document.getElementById('prompt');
const work   = document.getElementById('work');
const panel  = document.getElementById('panel');
const win    = document.querySelector('.reveal__window');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let entered = false;
let openView = null;     // 'about' | 'values' | 'contact' | project id
let chapter = 0;         // which numbered feature is showing

/* ============================================================
   start screen — the window drifts toward the cursor
   ============================================================ */

let driftX = 0, driftY = 0, targetX = 0, targetY = 0, rafId = null;

function drift() {
  driftX += (targetX - driftX) * 0.08;
  driftY += (targetY - driftY) * 0.08;
  win.style.setProperty('--drift-x', driftX.toFixed(2) + 'px');
  win.style.setProperty('--drift-y', driftY.toFixed(2) + 'px');
  rafId = Math.abs(targetX - driftX) > 0.1 || Math.abs(targetY - driftY) > 0.1
    ? requestAnimationFrame(drift)
    : null;
}

function aimAt(e) {
  if (entered || reduced) return;
  targetX = ((e.clientX / innerWidth) - 0.5) * 48;
  targetY = ((e.clientY / innerHeight) - 0.5) * 32;
  if (!rafId) rafId = requestAnimationFrame(drift);
}

function peek(on) {
  if (entered) return;
  stage.classList.toggle('is-peeking', on);
}

prompt.addEventListener('pointerenter', () => peek(true));
prompt.addEventListener('pointerleave', () => peek(false));

stage.addEventListener('pointermove', (e) => {
  if (entered || e.pointerType === 'touch') return;
  aimAt(e);
  const r = prompt.getBoundingClientRect();
  peek(
    e.clientX > r.left - 96 && e.clientX < r.right + 96 &&
    e.clientY > r.top - 72 && e.clientY < r.bottom + 72
  );
});

/* ============================================================
   start → home
   ============================================================ */

function enter({ byKeyboard = false } = {}) {
  if (entered) return;
  entered = true;
  targetX = targetY = 0;
  stage.classList.remove('is-peeking');
  stage.classList.add('is-entered');
  start.setAttribute('inert', '');
  home.removeAttribute('inert');
  if (byKeyboard) document.querySelector('.menu__item')?.focus({ preventScroll: true });
}

function exitToStart() {
  if (!entered) return;
  entered = false;
  closeView();
  stage.classList.remove('is-entered');
  home.setAttribute('inert', '');
  start.removeAttribute('inert');
}

stage.addEventListener('click', (e) => {
  if (entered || e.target.closest('.home')) return;
  enter();
});

/* ============================================================
   project pills
   ============================================================ */

function buildPills() {
  PROJECTS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'work__pill';
    b.dataset.project = p.id;
    b.style.setProperty('--pill', p.pill);
    b.style.left = p.x + '%';
    b.style.top = p.y + '%';
    b.style.setProperty('--delay', (i * 0.06) + 's');
    b.style.setProperty('--float', (7 + i * 0.8) + 's');
    b.innerHTML = `${p.title} <small>${p.note}</small>`;
    b.addEventListener('click', () => showProject(p.id));
    work.appendChild(b);
  });
}

function showWork(on) {
  work.classList.toggle('is-open', on);
}

/* ============================================================
   panels — pages and case studies
   ============================================================ */

function closeView() {
  openView = null;
  chapter = 0;
  panel.classList.remove('is-open');
  panel.setAttribute('inert', '');
  panel.innerHTML = '';
}

function openPanel(html, { onKey } = {}) {
  panel.innerHTML = html;
  panel.removeAttribute('inert');
  panel.classList.add('is-open');
  panel.querySelector('.panel__close')?.addEventListener('click', () => {
    closeView();
    markMenu('home');
    showWork(false);
  });
  panel._onKey = onKey || null;
}

function showPage(key) {
  const page = PAGES[key];
  if (!page) return;
  openView = key;
  showWork(false);
  openPanel(`
    <article class="panel__card">
      <button class="panel__close" type="button" aria-label="Close">Close</button>
      <h3 class="panel__title">${page.title}</h3>
      <p class="panel__subhead">${page.subhead}</p>
      ${page.body.map((t) => `<p class="panel__body">${t}</p>`).join('')}
    </article>
  `);
}

function showProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  openView = id;
  chapter = 0;
  renderChapter(p);
}

function renderChapter(p) {
  const total = p.features.length;
  const f = p.features[chapter];
  const dots = p.features
    .map((_, i) => `<button class="panel__dot" type="button" data-go="${i}" aria-label="Part ${i + 1} of ${total}"${i === chapter ? ' aria-current="true"' : ''}></button>`)
    .join('');

  openPanel(`
    <article class="panel__card panel__card--story">
      <button class="panel__close" type="button" aria-label="Close">Close</button>
      <header class="panel__head">
        <h3 class="panel__title">${p.title}</h3>
        <p class="panel__subhead">${p.subhead}</p>
      </header>
      <div class="panel__chapter" key="${chapter}">
        <span class="panel__num">${String(chapter + 1).padStart(2, '0')}</span>
        <h4 class="panel__feature">${f.title}</h4>
        <p class="panel__body">${f.body}</p>
      </div>
      <footer class="panel__foot">
        <div class="panel__dots">${dots}</div>
        <button class="panel__next" type="button">
          ${chapter + 1 < total ? 'Next' : 'Back to work'}
        </button>
      </footer>
    </article>
  `, {
    onKey(e) {
      if (e.key === 'ArrowRight') { step(p, 1); return true; }
      if (e.key === 'ArrowLeft')  { step(p, -1); return true; }
      return false;
    },
  });

  panel.querySelector('.panel__next').addEventListener('click', () => {
    if (chapter + 1 < total) step(p, 1);
    else { closeView(); markMenu('work'); showWork(true); }
  });
  panel.querySelectorAll('.panel__dot').forEach((d) => {
    d.addEventListener('click', () => { chapter = +d.dataset.go; renderChapter(p); });
  });
}

function step(p, by) {
  const next = chapter + by;
  if (next < 0 || next >= p.features.length) return;
  chapter = next;
  renderChapter(p);
}

/* ============================================================
   menu
   ============================================================ */

function markMenu(nav) {
  document.querySelectorAll('.menu__item').forEach((x) => {
    x.toggleAttribute('aria-current', x.dataset.nav === nav);
    if (x.dataset.nav === nav) x.setAttribute('aria-current', 'page');
  });
}

document.querySelectorAll('.menu__item').forEach((item) => {
  item.addEventListener('click', () => {
    const nav = item.dataset.nav;
    markMenu(nav);
    closeView();

    if (nav === 'work') { showWork(true); return; }
    showWork(false);
    if (nav !== 'home') showPage(nav);
  });
});

/* ============================================================
   keyboard
   ============================================================ */

document.addEventListener('keydown', (e) => {
  if (!entered) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter({ byKeyboard: true }); }
    return;
  }
  if (panel._onKey && panel._onKey(e)) { e.preventDefault(); return; }
  if (e.key === 'Escape') {
    if (openView) { closeView(); markMenu('home'); showWork(false); }
    else if (work.classList.contains('is-open')) { showWork(false); markMenu('home'); }
    else exitToStart();
  }
});

/* ---------- go ---------- */

buildPills();
panel.setAttribute('inert', '');
