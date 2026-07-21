import React from 'react';
import Logo2 from '../assets/Logo2.png';
import { footerLinks, socialMedia } from "../constants";

const Footer = () => (
  <footer className="bg-dark border-t border-gray-700 py-16">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        
        {/* Logo + Description */}
        <div className="flex-1">
          <img src={Logo2} alt="Motion Dynamics Logo" className="h-20 mb-6" />
          <p className="text-dimWhite max-w-sm leading-relaxed">
            The future of sport development through advanced motion capture and biomechanical precision.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-accent text-base font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.link}
                      className="text-dimWhite hover:text-secondary transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom Line */}
      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Motion Dynamics. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          {socialMedia.map((media) => (
            <a
              key={media.id}
              href={media.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <img src={media.icon} alt={media.id} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
