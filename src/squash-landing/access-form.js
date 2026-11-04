// The waiting-list form in the pop-out (copied from the Motion Dynamics squash app, src/landing/).
import { validateAccessRequest } from './validation.js';
import { submitAccessRequest } from './submit-access-request.js';

// The waiting-list form in the #access pop-out: name and email, checked here and stored by the server.
export function mountAccessForm(form) {
  const fields = form.querySelector('[data-access-fields]');
  const status = form.querySelector('[data-access-status]');
  const button = form.querySelector('button[type="submit"]');
  let pending = false;
  fields.disabled = false;
  // The note stays for browsers without scripts (a <noscript> is not shown when scripts are only switched off).
  const noScript = form.querySelector('[data-no-script]');
  if (noScript) noScript.hidden = true;

  function showErrors(errors) {
    for (const name of ['name', 'email']) {
      const message = errors[name] || '';
      const error = form.querySelector(`[data-error="${name}"]`);
      if (error) error.textContent = message;
      for (const control of form.querySelectorAll(`[name="${name}"]`))
        control.setAttribute('aria-invalid', String(Boolean(message)));
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (pending) return;
    const result = validateAccessRequest(Object.fromEntries(new FormData(form)));
    showErrors(result.ok ? {} : result.errors);
    if (!result.ok) {
      status.textContent = 'Check the highlighted fields.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    pending = true;
    button.disabled = true;
    status.textContent = '';
    try {
      const response = await submitAccessRequest(result.value);
      fields.hidden = true;
      form.reset();
      status.textContent = response.message;
      status.focus();
    } catch (error) {
      status.textContent =
        error?.status === 429
          ? 'Lots of people are signing up right now. Please try again in a minute.'
          : 'That did not go through. Please try again.';
      button.disabled = false;
    } finally {
      pending = false;
    }
  }

  // Any link to #access opens a fresh form, even after a sign-up on this page.
  function onOpen(event) {
    if (!event.target.closest('a[href="#access"]')) return;
    fields.hidden = false;
    button.disabled = false;
    status.textContent = '';
    showErrors({});
    form.querySelector('#access-name').focus({ preventScroll: true });
  }

  form.addEventListener('submit', onSubmit);
  document.addEventListener('click', onOpen);
  return function disposeAccessForm() {
    form.removeEventListener('submit', onSubmit);
    document.removeEventListener('click', onOpen);
  };
}
