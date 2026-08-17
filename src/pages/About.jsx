import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout fallback if Firebase is unreachable/keys missing
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const fetchData = async () => {
      try {
        const aboutDoc = await getDoc(doc(db, 'content', 'about'));
        if (aboutDoc.exists()) setAboutData(aboutDoc.data());
      } catch (error) {
        console.error("Error fetching about data:", error);
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
    <main>
      <section className="hero" style={{paddingTop: '60px', paddingBottom: '60px'}}>
        <div className="container">
          <span className="kicker">About Fabroklean</span>
          <h1>{aboutData?.headline || 'Your local laundry partner in Ballari.'}</h1>
          <p style={{maxWidth: '800px', fontSize: '18px', color: 'var(--muted)', whiteSpace: 'pre-wrap'}}>
            {aboutData?.paragraph || 'Fabroklean is a registered professional laundry service in Ballari, focused on quality, consistency and customer satisfaction. With more than 10 years of experience, we serve individuals, families and businesses with dependable laundry solutions.'}
          </p>
        </div>
      </section>

      <section style={{paddingTop: '40px'}}>
        <div className="container">
          <div className="about-photo" style={{width: '100%', height: '400px', borderRadius: '24px', background: `url("${aboutData?.heroImage || 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1200&q=80'}") center/cover`}}></div>
        </div>
      </section>

      <section className="services" style={{padding: '80px 0'}}>
        <div className="container">
           <div className="section-head">
             <h2>Our Commitment to Quality</h2>
             <p>We believe every garment deserves professional care.</p>
           </div>
           <div className="why-grid">
              <article className="why-card">
                <div className="icon">✓</div>
                <h3>Expert Care</h3>
                <p>Every fabric is different. Our experienced team knows exactly how to treat various materials to preserve their life and look.</p>
              </article>
              <article className="why-card">
                <div className="icon">✓</div>
                <h3>Hygiene First</h3>
                <p>We maintain strict hygiene protocols in our washing and finishing processes, ensuring your clothes are safely sanitized.</p>
              </article>
           </div>
        </div>
      </section>
    </main>
  );
}

export default About;
