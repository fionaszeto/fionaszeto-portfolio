# Fiona Szeto — portfolio

A non-scrolling portfolio built as a game menu. The start screen opens an
organic window onto the room; clicking through lets that window swallow the
screen and become the home menu.

Built from the Figma file **Portfolio Material**, page **Home**
(frames: `Start – v1`, `Start – v1 · hover`, `Home – v2`).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the build locally
```

## Add the room photo

The one asset the site needs is the room photograph.

1. Export it from Figma (the `Room` layer on the **Design System** page) as JPG.
2. Save it as `public/room.jpg`.

Until it exists, a gradient stand-in shows in its place. The photo is
referenced once, as `--room` in `src/styles.css`, so swapping it is a one-line
change if you want a different filename or a video later.

Keep it under about 400 KB. It is the only large asset and it loads before the
first frame anyone sees.

## Fonts

Tanker and Bespoke Serif load from Fontshare's CDN, declared in `index.html`.
Both are free for personal and commercial use.

If you would rather self-host them (one less third-party request, and no
dependency on Fontshare staying up), download the `.woff2` files, drop them in
`public/fonts/`, and replace the `<link>` with `@font-face` rules.

## Design tokens

Every colour, size and radius lives in `:root` at the top of `src/styles.css`,
named to match the Figma variable collections:

- `--text-primary` `#14161A`, `--text-muted` `#596070`, `--text-inactive` `#9A9A9A`
- `--accent-yellow` `#FFE96B`, `--accent-lavender` `#D2B9FF`, `--accent-sky` `#76B9FF`
- `--bg-page` `#F5F6F8`, `--bg-surface` `#FFFFFF`

The layout is scaled from the 1440 × 900 canvas: 32px panel inset, 40px panel
radius, 64px gutter inside the panel. All spacing is a multiple of 4.

## Projects

The project pills are data, not markup. Edit the `PROJECTS` array at the top of
`src/main.js` to change titles, labels, pill colours or where each one sits.

## Behaviour

- Nothing scrolls. Heights use `svh`, so mobile browser bars don't shift it.
- `Enter` or `Space` enters from the start screen; `Escape` goes back.
- `prefers-reduced-motion` turns the window animation off.
- The inactive screen is `inert`, so keyboard focus never lands on hidden UI.

## Deploy to Vercel

Vercel detects Vite automatically. Framework preset **Vite**, build command
`npm run build`, output directory `dist`.

```bash
npx vercel        # preview deploy
npx vercel --prod # production
```

Or connect the GitHub repo in the Vercel dashboard and it deploys on push.

## To do

- [ ] Add `public/room.jpg`
- [ ] About me, My values and Contact me screens
- [ ] Case studies as read-through chapters
- [ ] A real `<title>`, favicon, Open Graph image
