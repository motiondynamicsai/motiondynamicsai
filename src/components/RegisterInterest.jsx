import { useId, useState } from 'react';
import emailjs from 'emailjs-com';

const EMAILJS = { service: 'service_ap61j8c', template: 'template_17h6xit', key: 'QwWzmNgXcYEaZX4L1' };
const OFFER = 'Register interest: free match analysis + 50% off (squash)';

export default function RegisterInterest({ variant = 'hero', source }) {
  const id = useId();
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [name, setName] = useState('');

  const submit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setName(String(data.get('name')).trim().split(' ')[0]);
    setStatus('sending');
    emailjs.send(EMAILJS.service, EMAILJS.template, {
      name: data.get('name'),
      email: data.get('email'),
      message: `${OFFER}\nSource: ${source || variant}\nPage: ${window.location.href}`,
    }, EMAILJS.key)
      .then(() => { setStatus('done'); form.reset(); })
      .catch(() => setStatus('error'));
  };

  if (status === 'done') {
    return <div className={`sq-form sq-form-${variant} is-done`} role="status">
      <span className="sq-check" aria-hidden="true">✓</span>
      <div><strong>You’re on the list{name ? `, ${name}` : ''}.</strong><p>We’ll be in touch about your free match analysis and your 50% founding discount.</p></div>
    </div>;
  }

  return <form className={`sq-form sq-form-${variant}`} onSubmit={submit} aria-label="Register your interest">
    <div className="sq-fields">
      <label className="sq-field"><span>Name</span><input id={`${id}-name`} name="name" type="text" autoComplete="name" placeholder="Your name" required /></label>
      <label className="sq-field"><span>Email</span><input id={`${id}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" required /></label>
      <button className="sq-btn solid" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Registering…' : <>Register interest <span className="ar">→</span></>}</button>
    </div>
    {status === 'error'
      ? <p className="sq-form-note is-error" role="alert">That didn’t go through. Please try again, or email <a href="mailto:contact@motiondynamics.ai?subject=Register%20interest">contact@motiondynamics.ai</a>.</p>
      : <p className="sq-form-note"><b>Free match analysis</b> + <b>50% off</b> when we launch. No payment needed.</p>}
  </form>;
}
