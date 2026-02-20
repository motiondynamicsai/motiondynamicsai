import React from 'react';
import { Helmet } from 'react-helmet';
import emailjs from 'emailjs-com'; // <-- make sure this is installed
import styles from '../style';
import PropTypes from 'prop-types';
import Button from './Button';

const InputField = ({ label, type, name, id, placeholder, required }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-white text-sm font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      required={required}
      aria-label={label}
      className="w-full px-4 py-3 bg-primary/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/25 focus:border-secondary/35 transition-all"
    />
  </div>
);

const TextAreaField = ({ label, name, id, placeholder, rows, required }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-white text-sm font-medium mb-2">
      {label}
    </label>
    <textarea
      name={name}
      id={id}
      placeholder={placeholder}
      rows={rows}
      required={required}
      aria-label={label}
      className="w-full px-4 py-3 bg-primary/40 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-secondary/25 focus:border-secondary/35 transition-all"
    />
  </div>
);

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_ap61j8c',
      'template_17h6xit',
      e.target,
      'QwWzmNgXcYEaZX4L1'
    )
    .then((result) => {
      console.log('SUCCESS:', result.text);
      alert('Message sent successfully!');
    })
    .catch((error) => {
      console.error('FAILED:', error.text);
      alert('Something went wrong. Please try again later.');
    });

    e.target.reset();
  };

  return (
    <section id="contact" className="relative py-24 bg-primary overflow-hidden">
      <Helmet>
        <title>Contact Us - Motion Dynamics AI</title>
        <meta name="description" content="Get in touch with the Motion Dynamics AI team for collaboration, investment, or product inquiries." />
      </Helmet>

      <div className="absolute w-[60%] h-[60%] right-20 bottom-0 bg-secondary/10 rounded-full blur-3xl z-0" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em] text-dimWhite">
            <span className="h-px w-10 bg-secondary/60" />
            Contact
            <span className="h-px w-10 bg-accent/40" />
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
            Get In <span className="text-secondary">Touch</span>
          </h2>
          <p className="mt-4 text-lg text-dimWhite max-w-2xl mx-auto">
            Ready to accelerate your sports development? Contact our team today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto bg-dark/40 backdrop-blur-sm border border-white/10 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.85)] rounded-lg p-8"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-secondary/60 to-accent/40 opacity-80" />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <InputField
              label="Full Name"
              type="text"
              name="name"
              id="name"
              placeholder="John Smith"
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <TextAreaField
            label="Your Message"
            name="message"
            id="message"
            placeholder="Tell us about your project..."
            rows={5}
            required
          />
          <Button type="submit" className="w-full mt-6 py-4">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
