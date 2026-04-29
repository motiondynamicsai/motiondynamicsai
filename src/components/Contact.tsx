import { useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet';
import emailjs from 'emailjs-com';
import { motion, useReducedMotion } from 'framer-motion';
import { z } from 'zod';
import Button from './Button';
import { WordReveal } from './shared/WordReveal';

const HEADLINE_WORDS = ['Get', 'in', 'touch.'] as const;

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'A short message of at least 10 characters helps us reply well.')
    .max(2000),
});

type ContactInput = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactInput, string>>;

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  required?: boolean;
  error?: string;
}

const InputField = ({ label, type, name, id, placeholder, required, error }: InputFieldProps) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium mb-2"
      style={{ color: 'var(--color-md-text-hi)' }}
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      required={required}
      aria-label={label}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className="w-full px-4 py-3 rounded-md focus:outline-none"
      style={{
        backgroundColor: 'color-mix(in oklab, var(--color-md-bg) 70%, transparent)',
        border: `1px solid ${error ? 'var(--color-md-warn)' : 'color-mix(in oklab, var(--color-md-text-mid) 14%, transparent)'}`,
        color: 'var(--color-md-text-hi)',
        transition: 'border-color 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    />
    {error ? (
      <p
        id={`${id}-error`}
        className="mt-2 text-xs"
        style={{ color: 'var(--color-md-warn)' }}
      >
        {error}
      </p>
    ) : null}
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  id: string;
  placeholder: string;
  rows: number;
  required?: boolean;
  error?: string;
}

const TextAreaField = ({ label, name, id, placeholder, rows, required, error }: TextAreaFieldProps) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium mb-2"
      style={{ color: 'var(--color-md-text-hi)' }}
    >
      {label}
    </label>
    <textarea
      name={name}
      id={id}
      placeholder={placeholder}
      rows={rows}
      required={required}
      aria-label={label}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className="w-full px-4 py-3 rounded-md focus:outline-none"
      style={{
        backgroundColor: 'color-mix(in oklab, var(--color-md-bg) 70%, transparent)',
        border: `1px solid ${error ? 'var(--color-md-warn)' : 'color-mix(in oklab, var(--color-md-text-mid) 14%, transparent)'}`,
        color: 'var(--color-md-text-hi)',
        transition: 'border-color 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    />
    {error ? (
      <p
        id={`${id}-error`}
        className="mt-2 text-xs"
        style={{ color: 'var(--color-md-warn)' }}
      >
        {error}
      </p>
    ) : null}
  </div>
);

const Contact = () => {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (key === 'name' || key === 'email' || key === 'message') {
          if (!nextErrors[key]) nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      setStatusMessage(null);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setStatusMessage(null);

    emailjs
      .sendForm('service_ap61j8c', 'template_17h6xit', form, 'QwWzmNgXcYEaZX4L1')
      .then(() => {
        setSubmitting(false);
        setStatusMessage('Message sent — we will be in touch shortly.');
        form.reset();
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setSubmitting(false);
        setStatusMessage(`Something went wrong: ${message}. Please try again later.`);
      });
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--color-md-bg)' }}
    >
      <Helmet>
        <title>Contact Us - Motion Dynamics AI</title>
        <meta
          name="description"
          content="Get in touch with the Motion Dynamics AI team for collaboration, investment, or product inquiries."
        />
      </Helmet>

      <div
        aria-hidden="true"
        className="absolute w-[60%] h-[60%] right-20 bottom-0 rounded-full blur-3xl z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, var(--color-md-accent) 12%, transparent), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className="flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em]"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent) 60%, transparent)' }}
            />
            Contact
            <span
              className="h-px w-10"
              style={{ backgroundColor: 'color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent)' }}
            />
          </div>
          <h2
            id="contact-heading"
            className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight"
            style={{ color: 'var(--color-md-text-hi)' }}
          >
            <WordReveal
              words={HEADLINE_WORDS}
              reduced={reduced}
              className="flex flex-wrap justify-center"
            />
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-md-text-mid)' }}
          >
            Ready to accelerate your sports development? Contact our team today.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="relative max-w-2xl mx-auto rounded-md p-8"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-md-surface) 80%, transparent)',
            border: '1px solid color-mix(in oklab, var(--color-md-text-mid) 12%, transparent)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, color-mix(in oklab, var(--color-md-accent) 60%, transparent), color-mix(in oklab, var(--color-md-accent-soft) 35%, transparent))',
              opacity: 0.7,
            }}
          />

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <InputField
              label="Full name"
              type="text"
              name="name"
              id="name"
              placeholder="John Smith"
              required
              error={errors.name}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="john@example.com"
              required
              error={errors.email}
            />
          </div>
          <TextAreaField
            label="Your message"
            name="message"
            id="message"
            placeholder="Tell us about your project..."
            rows={5}
            required
            error={errors.message}
          />

          <div className="mt-6 flex items-center gap-3">
            <Button type="submit" className="flex-1 py-4" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send message'}
            </Button>
            <motion.span
              aria-hidden="true"
              className="inline-block rounded-full"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--color-md-accent)',
                boxShadow: '0 0 12px color-mix(in oklab, var(--color-md-accent) 60%, transparent)',
              }}
              animate={
                reduced
                  ? undefined
                  : { opacity: [0.4, 1, 0.4], scale: [1, 1.18, 1] }
              }
              transition={
                reduced
                  ? undefined
                  : { duration: 1.2, ease: 'easeInOut', repeat: Infinity }
              }
            />
          </div>

          {statusMessage ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 text-sm tabular-nums"
              style={{ color: 'var(--color-md-text-mid)' }}
            >
              {statusMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export { Contact };
export default Contact;
