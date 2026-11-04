// @ts-check
// The Request access pop-out. Every link to #access (Request access, Talk to us, Contact, the plan buttons) opens the
// form in a modal dialog over the page; the close button, Escape and a click outside the dialog close it. Without
// JavaScript the same links still reach the form: the stylesheet shows the dialog in the page when it is the URL target.
// Arriving at /#access opens it at once.

/** @param {Document} root */
export function mountAccessDialog(root) {
  const dialog = root.querySelector('dialog#access');
  if (!(dialog instanceof HTMLDialogElement)) return () => {};

  /** @param {MouseEvent} event */
  function onClick(event) {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    if (target.closest('[data-close]')) {
      dialog.close();
      return;
    }
    if (target === dialog) {
      const box = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (!inside) dialog.close();
      return;
    }
    if (!target.closest('a[href="#access"]')) return;
    event.preventDefault();
    if (!dialog.open) dialog.showModal();
  }

  root.addEventListener('click', onClick);

  // A visit to /#access (the US Open QR code) opens the form straight away. The hash is dropped first so closing
  // the dialog leaves the plain page, not the no-JavaScript in-page copy that the stylesheet shows for #access.
  const view = root.defaultView;
  if (view && view.location.hash === '#access') {
    view.history.replaceState(view.history.state, '', view.location.pathname + view.location.search);
    // After the form has mounted and enabled its fields, so the dialog opens with focus in Name.
    queueMicrotask(() => {
      if (!dialog.open) dialog.showModal();
    });
  }
  return function disposeAccessDialog() {
    root.removeEventListener('click', onClick);
  };
}
