// Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Header.css'; // Import your CSS file

function Header() {
  return (
    <header className="header">
      <h1>Live Streaming</h1>
      <nav>
        <Link to="/">Home</Link> {/* Use Link instead of a */}
        <Link to="/login">Login</Link>
        <Link to="/about">About</Link> 
        <Link to="/VideoUpload">VideoUpload</Link> 
        <Link to="/VideoList">VideoList</Link> 
      </nav>
    </header>
  );
}

export default Header;
