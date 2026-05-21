import { useState } from 'react';

export function ContactSection({ content }) {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');

    if (!name || !email || !message) {
      setStatus('Please complete all fields.');
      return;
    }

    const subject = encodeURIComponent(`Motion Dynamics enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${content.email}?subject=${subject}&body=${body}`;
    setStatus('Opening your email app...');
    form.reset();
  }

  return (
    <section className="scene contact-section" id="contact">
      <div className="section-intro">
        <p className="kicker">Contact</p>
        <h2>{content.title}</h2>
        <p>{content.text}</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" placeholder="John Smith" type="text" />
        </label>
        <label>
          Email
          <input name="email" placeholder="john@example.com" type="email" />
        </label>
        <label>
          Your Message
          <textarea name="message" placeholder="Tell us about your project..." rows="5" />
        </label>
        <button className="button" type="submit">Send Message</button>
        <p className="form-status" role="status">{status}</p>
      </form>
    </section>
  );
}
