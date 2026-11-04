import { useEffect } from 'react';
import markup from './landing.html?raw';
import './squash-landing.css';
import { mountAccessDialog } from './access-dialog.js';
import { mountAccessForm } from './access-form.js';

// The home page: the Motion Dynamics squash landing. Its markup is static HTML (landing.html) and its styles are
// scoped to #mds (squash-landing.css), so it looks the same here as on its own and nothing leaks into other pages.
// While it is on screen it sets the page-level things a container can't: tab title, description, the phone's
// browser-bar color, and the dark page background behind overscroll. Leaving the page puts them back.
const PAGE = {
  title: 'Motion Dynamics squash · Every rally. Analyzed.',
  description: 'Every shot from your recorded squash matches, on the court. Every rally on video. For players and coaches.',
  color: '#08101f',
};

function setPageLevel() {
  const html = document.documentElement;
  const description = document.querySelector('meta[name="description"]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  // index.html may already have painted the page dark before the app loaded; it keeps the site's own color in
  // data-site-color, and the site sets no inline background of its own, so those are what leaving puts back.
  const before = {
    title: document.title,
    description: description?.getAttribute('content'),
    themeColor: themeColor?.getAttribute('data-site-color') ?? themeColor?.getAttribute('content'),
    background: '',
    colorScheme: html.style.colorScheme,
    scrollPaddingTop: html.style.scrollPaddingTop,
  };
  document.title = PAGE.title;
  description?.setAttribute('content', PAGE.description);
  themeColor?.setAttribute('content', PAGE.color);
  html.style.background = PAGE.color;
  html.style.colorScheme = 'dark';
  html.style.scrollPaddingTop = '24px';
  return function restorePageLevel() {
    document.title = before.title;
    if (before.description != null) description.setAttribute('content', before.description);
    if (before.themeColor != null) themeColor.setAttribute('content', before.themeColor);
    html.style.background = before.background;
    html.style.colorScheme = before.colorScheme;
    html.style.scrollPaddingTop = before.scrollPaddingTop;
  };
}

export default function SquashLanding() {
  useEffect(() => {
    const restorePageLevel = setPageLevel();
    // The dialog listens first, so it is open before the form moves focus into it.
    const disposeDialog = mountAccessDialog(document);
    const disposeForm = mountAccessForm(document.getElementById('access-form'));
    return () => {
      disposeForm();
      disposeDialog();
      restorePageLevel();
    };
  }, []);
  return <div id="mds" dangerouslySetInnerHTML={{ __html: markup }} />;
}
