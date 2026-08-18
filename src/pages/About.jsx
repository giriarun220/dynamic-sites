import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SkeletonLoader from '../components/SkeletonLoader';

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [teamData, setTeamData] = useState([]);
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

        const teamDoc = await getDoc(doc(db, 'content', 'doctors'));
        if (teamDoc.exists()) setTeamData(teamDoc.data().items || []);
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

  if (loading) return (
    <main className="container" style={{paddingTop: '60px'}}>
      <div style={{textAlign: 'center', marginBottom: '60px'}}>
        <SkeletonLoader type="text" className="skeleton-title" style={{margin: '0 auto 20px'}} />
        <SkeletonLoader type="text" count={3} />
      </div>
      <div className="grid">
        <SkeletonLoader type="profile" count={4} />
      </div>
    </main>
  );

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

      {teamData.length > 0 && (
        <section style={{padding: '80px 0', background: '#f8fafc'}}>
          <div className="container">
            <div className="section-head">
              <h2>Meet Our Team</h2>
              <p>The professionals behind our premium services.</p>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px'}}>
              {teamData.map((member, idx) => (
                <div key={idx} style={{background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', textAlign: 'center', paddingBottom: '20px'}}>
                  {member.image ? (
                    <div style={{width: '100%', height: '250px', backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '20px'}}></div>
                  ) : (
                    <div style={{width: '100%', height: '250px', background: '#e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                       <span style={{fontSize: '40px', color: '#94a3b8'}}>👤</span>
                    </div>
                  )}
                  <h3 style={{margin: '0 0 5px'}}>{member.name}</h3>
                  <div style={{color: '#0ea5e9', fontWeight: 'bold', fontSize: '14px', marginBottom: '15px'}}>{member.role}</div>
                  <p style={{color: 'var(--muted)', fontSize: '14px', padding: '0 20px'}}>{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default About;
