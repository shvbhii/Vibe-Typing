

import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = ({ githubUrl, linkedinUrl }) => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
          <FaLinkedin size={22} /> {/*icon size */}
          <span>Connect</span>
        </a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
          <FaGithub size={22} /> {/* icon size */}
          <span>Source</span>
        </a>
      </div>
      <div className="footer-credit">
        Made by Shubhi Sharma
      </div>
    </footer>
  );
};

export default Footer;