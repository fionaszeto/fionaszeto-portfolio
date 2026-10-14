/* All site copy lives here. Edit this file, not the markup.
   Case studies follow the portfolio template: title, a subheadline saying
   what the thing is, then numbered features with short factual descriptions.

   NOTE: the feature copy below is placeholder. The structure is right; the
   words are for you to replace. */

export const PROJECTS = [
  {
    id: 'bob',
    title: 'Bob the Blob',
    note: 'Thesis',
    pill: 'var(--accent-yellow)',
    x: 48, y: 24,
    subhead: 'An AI companion that sits beside you while you play.',
    features: [
      { title: 'Ambient presence', body: 'Bob stays on screen during play and reacts to what happens in the game, without taking input away from the player.' },
      { title: 'Reads the moment', body: 'Tone shifts with the state of the session — quiet during focus, livelier between rounds.' },
      { title: 'Memory across sessions', body: 'Remembers what you played and what went wrong last time, so the next conversation starts in the middle.' },
      { title: 'Designed to be ignorable', body: 'Every behaviour has a resting state. The companion never requires a response to keep working.' },
    ],
  },
  {
    id: 'shifroll',
    title: 'ShifRoll',
    note: 'Design system',
    pill: 'var(--accent-lavender)',
    x: 62, y: 40,
    subhead: 'A calendar and alarm app built for people who work shifts.',
    features: [
      { title: 'Rotating schedules', body: 'Handles patterns that repeat on cycles other than a week, which standard calendars assume.' },
      { title: 'High stress alerts', body: 'Alarms escalate on the shifts that matter and stay quiet on the ones that do not.' },
      { title: 'Semantic colour roles', body: 'Colour roles were defined before any palette was chosen, so the system survived a full visual change.' },
      { title: 'Foundations first', body: 'Built in phases — foundations, then components, then full-page application.' },
    ],
  },
  {
    id: 'attune',
    title: 'Attune',
    note: 'Concept',
    pill: 'var(--accent-sky)',
    x: 44, y: 56,
    subhead: 'Designing for how people feel, one small moment at a time.',
    features: [
      { title: 'Check in, not track', body: 'Records a state in one gesture rather than asking for a rating and a reason.' },
      { title: 'No streaks', body: 'Nothing rewards consecutive days, because a missed day is not a failure.' },
      { title: 'Patterns over entries', body: 'Shows what tends to happen around a feeling rather than listing what was logged.' },
    ],
  },
  {
    id: 'nyt',
    title: 'NYT Cooking',
    note: 'Redesign',
    pill: 'var(--bg-surface)',
    x: 64, y: 70,
    subhead: 'Making a recipe app usable when you have a dietary restriction.',
    features: [
      { title: 'Filter before you browse', body: 'Restrictions are set once and applied to every surface, instead of filtered per search.' },
      { title: 'Ingredient substitutions', body: 'Shows what can replace a flagged ingredient inside the recipe, not in a separate article.' },
      { title: 'Tested with real constraints', body: 'Scenario testing used an actual restriction and the ingredients already in the fridge.' },
    ],
  },
  {
    id: 'stars',
    title: 'Connect the Stars',
    note: 'Play',
    pill: 'var(--accent-yellow)',
    x: 40, y: 82,
    subhead: 'A small interactive piece about finding shapes in noise.',
    features: [
      { title: 'Draw your own constellation', body: 'Points connect as you drag between them, and the shape is kept rather than scored.' },
      { title: 'No wrong answer', body: 'There is no target figure. What you make is what the piece shows back to you.' },
    ],
  },
];

export const PAGES = {
  about: {
    title: 'About me',
    subhead: 'Product and Interaction Designer trained in Psychology.',
    body: [
      'I design interactions that help people feel understood. My background in Psychology shapes how I approach research and how I read what people actually do, rather than what they say they do.',
      'I am currently finishing an MFA in Interaction Design at the School of Visual Arts in New York.',
      'Outside the screen I dance, sing and produce music, which is where most of my thinking about timing and rhythm comes from.',
    ],
  },
  values: {
    title: 'My values',
    subhead: 'What I hold to when the work gets difficult.',
    body: [
      'Say the plain thing. Functional language beats poetic language when someone is trying to understand what a product does.',
      'Decide the roles before the look. A system that knows what each part is for survives a change of style.',
      'Design the resting state. Anything that demands attention should also know how to be quiet.',
    ],
  },
  contact: {
    title: 'Contact me',
    subhead: 'Open to full-time roles and selected freelance work.',
    body: [
      'szeto.yung@gmail.com',
      'Based in New York.',
    ],
  },
};
