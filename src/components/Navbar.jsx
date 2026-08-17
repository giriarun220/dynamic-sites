import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const setDocRef = await getDoc(doc(db, 'content', 'settings'));
        if (setDocRef.exists()) setSettings(setDocRef.data());
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <div className="top-bar">
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
          <div style={{display: 'flex', gap: '20px'}}>
            <span>📞 {settings?.phone || '+91 9449422175'}</span>
            <span>✉️ {settings?.email || 'hello@fabroklean.com'}</span>
          </div>
          <div>
            <span>{settings?.emergency || 'Emergency / Urgent Care Available'}</span>
          </div>
        </div>
      </div>

      <header>
        <div className="container">
          <nav>
            <Link className="brand" to="/">
              <span className="brandmark">F</span>Fabroklean
            </Link>
            <div className="navlinks">
              <Link to="/about">About</Link>
              <Link to="/#services">Services</Link>
              <Link to="/#process">How It Works</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
              <Link className="btn btn-primary" to="/contact">Book a Service</Link>
            </div>
            <button className="menu" aria-label="Open menu" onClick={toggleMenu}>☰</button>
          </nav>
          {menuOpen && (
            <div id="mobileNav" style={{ padding: '0 0 16px' }}>
              <div style={{ display: 'grid', gap: '12px', padding: '14px 0' }}>
                <Link to="/about" onClick={toggleMenu}>About</Link>
                <Link to="/#services" onClick={toggleMenu}>Services</Link>
                <Link to="/#process" onClick={toggleMenu}>How It Works</Link>
                <Link to="/blog" onClick={toggleMenu}>Blog</Link>
                <Link to="/contact" onClick={toggleMenu}>Contact</Link>
                <Link className="btn btn-primary" to="/contact" onClick={toggleMenu}>Book a Service</Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Navbar;
