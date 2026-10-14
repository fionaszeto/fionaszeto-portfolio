/* Fiona Szeto — portfolio
   Two states on one non-scrolling stage:
   start  → hovering the prompt opens an organic window onto the room
   home   → the window swallows the screen and the menu takes over
*/

const stage  = document.getElementById('stage');
const start  = document.getElementById('start');
const home   = document.getElementById('home');
const prompt = document.getElementById('prompt');
const work   = document.getElementById('work');

const PROJECTS = [
  { title: 'Bob the Blob',      note: 'Thesis',        pill: 'var(--accent-yellow)',   x: 48, y: 22 },
  { title: 'ShifRoll',          note: 'Design system', pill: 'var(--accent-lavender)', x: 62, y: 38 },
  { title: 'Attune',            note: 'Concept',       pill: 'var(--accent-sky)',      x: 44, y: 54 },
  { title: 'NYT Cooking',       note: 'Redesign',      pill: 'var(--bg-surface)',      x: 64, y: 68 },
  { title: 'Connect the Stars', note: 'Play',          pill: 'var(--accent-yellow)',   x: 40, y: 80 },
];

let entered = false;

/* ---------- build the project pills ---------- */

function buildProjects() {
  PROJECTS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'work__pill';
    b.style.setProperty('--pill', p.pill);
    b.style.left = p.x + '%';
    b.style.top = p.y + '%';
    b.style.transitionDelay = (0.04 + i * 0.06) + 's';
    b.innerHTML = `${p.title} <small>${p.note}</small>`;
    work.appendChild(b);
  });
}

/* ---------- start → home ---------- */

function peek(on) {
  if (entered) return;
  stage.classList.toggle('is-peeking', on);
}

function enter({ byKeyboard = false } = {}) {
  if (entered) return;
  entered = true;
  stage.classList.remove('is-peeking');
  stage.classList.add('is-entered');
  start.setAttribute('inert', '');
  home.removeAttribute('inert');
  // only hand over focus when they arrived by keyboard, so a click
  // doesn't leave a focus ring sitting on the first menu item
  if (byKeyboard) document.querySelector('.menu__item')?.focus({ preventScroll: true });
}

function exit() {
  if (!entered) return;
  entered = false;
  stage.classList.remove('is-entered');
  work.classList.remove('is-open');
  home.setAttribute('inert', '');
  start.removeAttribute('inert');
}

/* open the window when the cursor is near the prompt, not only exactly on it */
prompt.addEventListener('pointerenter', () => peek(true));
prompt.addEventListener('pointerleave', () => peek(false));

stage.addEventListener('pointermove', (e) => {
  if (entered || e.pointerType === 'touch') return;
  const r = prompt.getBoundingClientRect();
  peek(
    e.clientX > r.left - 96 && e.clientX < r.right + 96 &&
    e.clientY > r.top - 72 && e.clientY < r.bottom + 72
  );
});

stage.addEventListener('click', (e) => {
  if (entered || e.target.closest('.home')) return;
  enter();
});

document.addEventListener('keydown', (e) => {
  if (!entered && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    enter({ byKeyboard: true });
  } else if (entered && e.key === 'Escape') {
    exit();
  }
});

/* ---------- menu ---------- */

document.querySelectorAll('.menu__item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.menu__item').forEach((x) => x.removeAttribute('aria-current'));
    item.setAttribute('aria-current', 'page');
    work.classList.toggle('is-open', item.dataset.nav === 'work');
  });
});

buildProjects();
