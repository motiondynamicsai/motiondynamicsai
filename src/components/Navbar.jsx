import { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import Logo2 from '../assets/Logo2.png';
import { navLinks } from '../constants';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`w-full z-50 fixed top-0 left-0 bg-primary/90 backdrop-blur-sm border-b border-gray-900 transition-all ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo2} alt="Logo" className="h-20" />

        </div>

       {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-14 items-center text-xl">
          {navLinks.map((link) => (
            <HashLink
              key={link.id}
              smooth
              to={link.link}
              className="text-dimWhite hover:text-white transition-colors font-medium"
            >
              {link.title}
            </HashLink>
          ))}
          <Link
            to="/storyboard"
            className="text-dimWhite hover:text-white transition-colors font-medium"
          >
            Partnerships
          </Link>
        </div>


        {/* Contact Button */}
        <HashLink smooth to="/#contact">
          <button className="ml-4 px-5 py-2 rounded-md bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:shadow-md transition-all">
            Contact
          </button>
        </HashLink>
      </div>
    </nav>
  );
};

export default Navbar;
