import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

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
      <section className="final">
        <div className="container final-inner">
          <div>
            <span className="kicker">Fabroklean • Ballari</span>
            <h2>Cleaner. Fresher. Better cared for.</h2>
            <p>Professional laundry and dry-cleaning care for the things you value.</p>
          </div>
          <div className="actions">
            <Link className="btn btn-primary" to="/contact">Book a Service</Link>
            <a className="btn btn-light" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${settings?.phone?.replace(/[^0-9]/g, '') || '919449422175'}?text=Hi%20Fabroklean%2C%20I%20would%20like%20to%20book%20a%20service.`}>WhatsApp Us</a>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand" style={{ color: '#fff' }}>
                <span className="brandmark">F</span>Fabroklean
              </div>
              <p style={{ maxWidth: '420px', fontSize: '14px' }}>
                Professional laundry and dry-cleaning services in Ballari, focused on quality, consistency, fabric care and customer convenience.
              </p>
            </div>
            <div>
              <div className="footer-title">Quick Links</div>
              <div className="footer-links">
                <Link to="/about">About</Link>
                <Link to="/#services">Services</Link>
                <Link to="/#process">How It Works</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/admin">Admin Login</Link>
              </div>
            </div>
            <div>
              <div className="footer-title">Contact</div>
              <div className="footer-links">
                <a href={`tel:${settings?.phone || '+919449422175'}`}>{settings?.phone || '+91 9449422175'}</a>
                <a href={`mailto:${settings?.email || 'info@FabroKlean.com'}`}>{settings?.email || 'info@FabroKlean.com'}</a>
                <a target="_blank" rel="noopener noreferrer" href={settings?.mapUrl || "https://www.google.com/maps/search/?api=1&query=Fabroklean%2C%20Opp%20to%20Fire%20Station%2C%20Ballari%2C%20583104%2C%20Karnataka"}>Ballari, Karnataka</a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <span>© {currentYear} Fabroklean. All rights reserved.</span>
            <span>Professional Laundry & Dry Cleaning • Ballari</span>
          </div>
        </div>
      </footer>
      <a className="wa" aria-label="Chat on WhatsApp" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${settings?.phone?.replace(/[^0-9]/g, '') || '919449422175'}?text=Hi%20Fabroklean%2C%20I%20would%20like%20to%20book%20a%20service.`}>◔</a>
    </>
  );
}

export default Footer;
