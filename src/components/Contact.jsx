
import styles from '../style'; // Import your global styles

const Contact = () => {
  return (
    <section id="contact" className={`${styles.section} bg-background py-12`}>
      <div className="container mx-auto px-4">
        <h2 className={`${styles.heading2} text-center text-white`}>Contact Us</h2>
        <form action="https://formspree.io/f/mwkgyrwd" method="POST" className="max-w-lg mx-auto mt-8 bg-dimWhite p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
              Full Name
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Your Full Name"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              name="_replyto"
              id="email"
              placeholder="Your Email Address"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="message"
              id="message"
              placeholder="Your Message"
              rows="4"
              required
            />
          </div>
          <div className="text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
