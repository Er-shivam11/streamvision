// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p>
                Follow us on: 
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a> | 
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a> | 
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
            </p>
            <p>
                <a href="/terms">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
            </p>
        </footer>
    );
};

export default Footer;
