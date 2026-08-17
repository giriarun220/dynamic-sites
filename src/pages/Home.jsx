import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Home() {
  const [homepage, setHomepage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout fallback so page doesn't get stuck on "Loading..." if Firebase blocks it
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const fetchData = async () => {
      try {
        const homeDoc = await getDoc(doc(db, 'content', 'homepage'));
        if (homeDoc.exists()) setHomepage(homeDoc.data());

        const servDoc = await getDoc(doc(db, 'content', 'services'));
        if (servDoc.exists()) setServices(servDoc.data().items || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };
    fetchData();
    
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <div style={{padding: '100px', textAlign: 'center', fontSize: '20px', color: '#64748b'}}>Connecting to database...</div>;

  return (
    <main id="home">
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">● {homepage?.operator || '10+ years of professional experience'}</span>
            <h1>{homepage?.headline || 'Professional laundry & dry cleaning, done with care.'}</h1>
            <p>{homepage?.address || 'Fresh, clean and carefully handled garments with professional laundry, dry cleaning and fabric-care services.'}</p>
            <div className="actions">
              <Link className="btn btn-primary" to="/contact">Book a Service →</Link>
              <a className="btn btn-light" href="#services">Explore Services</a>
            </div>
            <div className="hero-note"><span className="dot"></span> {homepage?.name || 'Fabroklean'}</div>
          </div>
          <div className="hero-visual">
            <div className="photo" role="img" aria-label="Freshly cleaned and folded laundry" style={homepage?.bannerImage ? { backgroundImage: `url(${homepage.bannerImage})` } : {}}></div>
            <div className="float-card experience"><strong>10+</strong><span>Years of experience</span></div>
            <div className="float-card pickup"><strong>Doorstep</strong><span>Pickup & delivery</span></div>
          </div>
        </div>
      </section>

      <div className="trust"><div className="container"><div className="trust-grid">
        <div className="trust-item"><strong>10+ Years</strong><span>Professional experience</span></div>
        <div className="trust-item"><strong>Professional</strong><span>Cleaning & finishing</span></div>
        <div className="trust-item"><strong>Fabric Care</strong><span>Careful handling</span></div>
        <div className="trust-item"><strong>Doorstep</strong><span>Pickup & delivery</span></div>
      </div></div></div>

      <section id="services" className="services">
        <div className="container">
          <div className="section-head"><span className="kicker">Our Services</span><h2>Complete laundry solutions under one roof.</h2><p>Everyday clothing, special garments and fabric-care services — presented clearly so you can choose what you need.</p></div>
          <div className="service-grid">
            {services.length > 0 ? services.map((srv, idx) => (
              <article className="service" key={idx}>
                <div className="service-img" style={{backgroundImage:`url('${srv.image || 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=700&q=80'}')`}}></div>
                <div className="service-body">
                  <h3>{srv.icon} {srv.title}</h3>
                  <p>{srv.desc}</p>
                </div>
              </article>
            )) : (
              <p style={{ color: '#64748b' }}>No services published yet. Go to Admin Dashboard to add services.</p>
            )}
          </div>
        </div>
      </section>
      
      <section className="feature-band">
        <div className="container feature-grid">
          <div><div className="section-head"><span className="kicker" style={{color:'#67e8f9'}}>Pickup & Delivery</span><h2>Laundry care that comes to you.</h2><p>{homepage?.name || 'Fabroklean'} offers doorstep pickup and delivery so you can spend less time managing laundry and more time on what matters.</p></div>
            <div className="actions"><Link className="btn" style={{background:'#22d3ee',color:'#06283f'}} to="/contact">Book a Pickup</Link><a className="btn" style={{background:'rgba(255,255,255,.08)',color:'#fff',borderColor:'rgba(255,255,255,.22)'}} href="https://wa.me/919449422175?text=Hi%20Fabroklean%2C%20I%20would%20like%20to%20book%20a%20laundry%20service." target="_blank" rel="noopener noreferrer">WhatsApp Us</a></div>
          </div>
          <div className="visual-card" aria-label="Professional laundry care"></div>
        </div>
      </section>

    </main>
  );
}

export default Home;

