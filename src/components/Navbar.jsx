import { useState } from 'react';
import MDlogo from '../assets/MDlogo.png';  // Import the PNG logo
import { navLinks } from '../constants';
import {close, menu} from '../assets'

const Navbar = () => {

  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={MDlogo} alt="motiondynamics" className="h-[150px] auto-width" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[18px] ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'} text-white`}
          >
            <a href={`#${nav.id}`}>
              {nav.title}
            </a>
          </li>
        ))}
      </ul>
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img src={toggle ? close : menu}
        alt = "menu"
        className="w-[24px] h-[24px] object-contain"
        onClick={() => setToggle((prev) => !prev)}
        />

        <div className={`${toggle ? 'flex' : 'hidden'} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-x1 sidebar`}
        >
          <ul className="list-none flex-col justify-end items-center flex-1">
          {navLinks.map((nav, index) => (
            <li
              key={nav.id}
              className={`font-poppins font-normal cursor-pointer text-[18px] ${index === navLinks.length - 1 ? 'mr-0' : 'mb-4'} text-white`}
            >
              <a href={`#${nav.id}`}>
                {nav.title}
              </a>
            </li>
          ))}
        </ul>

        </div>
        
        
      </div>
    </nav>
  );
};

export default Navbar;
