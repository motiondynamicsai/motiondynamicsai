import React from 'react';
import './ContactSection.css'; // Create this CSS file for custom styles if needed

function ContactSection() {
  return (
    <section id="contact" className="section">
      <h2>Contact Us</h2>
      <form action="https://formspree.io/f/mwkgyrwd" method="POST">
        <div className="field">
          <label className="label">Full Name</label>
          <div className="control">
            <input className="input" type="text" name="fullname" placeholder="Your Full Name" required />
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" name="_replyto" placeholder="Your Email Address" required />
          </div>
        </div>
        <div className="field">
          <label className="label">Message</label>
          <div className="control">
            <textarea className="textarea" name="message" placeholder="Your Message" required></textarea>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">Submit</button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ContactSection;
