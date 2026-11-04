// The waiting-list form's checks. The Motion Dynamics squash server applies the same rules, so the two never disagree.
/* eslint-disable no-control-regex -- the checks reject hidden control characters on purpose */

export function validateAccessRequest(input) {
  const text = key => (typeof input[key] === 'string' ? input[key].trim() : '');
  const value = { name: text('name'), email: text('email') };
  const errors = {};
  if (!value.name || value.name.length > 120 || /[\x00-\x1f\x7f]/.test(value.name)) errors.name = 'Enter your name.';
  if (
    value.email.length > 254 ||
    /[\x00-\x1f\x7f]/.test(value.email) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
  )
    errors.email = 'Enter a valid email address.';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
