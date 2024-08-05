import React from 'react';
import { Link } from 'react-scroll';
import './App.css';
import TeamSection from './TeamSection'; // Import the TeamSection component
import ContactSection from './ContactSection'; // Import the ContactSection component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="navbar">
          <img src={`${process.env.PUBLIC_URL}/Logo-Recovered.png`} alt="Logo" className="logo" /> {/* Add the logo here */}
          <Link 
            to="home" 
            smooth={true} 
            duration={500}
            offset={-70} // Adjust this value if you have a fixed header
          >
            Home
          </Link>
          <Link 
            to="about" 
            smooth={true} 
            duration={500}
            offset={-70}
          >
            About Us
          </Link>
          <Link 
            to="services" 
            smooth={true} 
            duration={500}
            offset={-70}
          >
            Services
          </Link>
          <Link 
            to="team" 
            smooth={true} 
            duration={500}
            offset={-70}
          >
            Our Team
          </Link>
          <Link 
            to="contact" 
            smooth={true} 
            duration={500}
            offset={-70}
          >
            Contact
          </Link>
        </div>
        <div className="main-content">
          <section id="home">
            <h1>Welcome to Motion Dynamics</h1>
            <p>Your partner in innovative motion solutions.</p>
          </section>
          <section id="about" className="section">
            <h2>About Us</h2>
            <p>We specialize in providing cutting-edge motion technologies to help your business move forward.</p>
          </section>
          <section id="services" className="section">
            <h2>Our Services</h2>
            <ul>
              <li>Motion Control Systems</li>
              <li>Automation Solutions</li>
              <li>Consulting and Support</li>
            </ul>
          </section>
          <section id="team" className="section">
            <TeamSection /> {/* Add the TeamSection component here */}
          </section>
          <section id="contact" className="section">
            <ContactSection /> {/* Add the ContactSection component here */}
          </section>
        </div>
      </header>
      <footer className="footer">
        <p>&copy; 2024 Motion Dynamics. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
