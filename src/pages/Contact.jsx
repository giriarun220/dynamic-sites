import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import SkeletonLoader from '../components/SkeletonLoader';

function Contact() {
  const [contactData, setContactData] = useState(null);
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout fallback if Firebase is unreachable/keys missing
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const fetchData = async () => {
      try {
        const contactDoc = await getDoc(doc(db, 'content', 'contact'));
        if (contactDoc.exists()) setContactData(contactDoc.data());

        const settingsDoc = await getDoc(doc(db, 'content', 'settings'));
        if (settingsDoc.exists()) setSettingsData(settingsDoc.data());
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };
    fetchData();
    
    return () => clearTimeout(timeout);
  }, []);

  const phone = settingsData?.phone || '+91 9449422175';
  const rawPhone = phone.replace(/\D/g, '');

  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = `Hi Fabroklean, I would like to book a service.%0A%0AName: ${encodeURIComponent(formData.get('name'))}%0APhone: ${encodeURIComponent(formData.get('phone'))}%0AService: ${encodeURIComponent(formData.get('service'))}%0AMessage: ${encodeURIComponent(formData.get('message'))}`;
    window.open(`https://wa.me/${rawPhone}?text=${text}`, '_blank');
  };

  if (loading) return (
    <main className="container" style={{paddingTop: '60px'}}>
      <SkeletonLoader type="text" className="skeleton-title" style={{margin: '0 auto 20px'}} />
      <SkeletonLoader type="card" count={1} />
    </main>
  );

  return (
    <main>
      <section className="contact" style={{paddingTop: '60px', paddingBottom: '100px'}}>
        <div className="container">
          <div className="section-head">
            <span className="kicker">Get In Touch</span>
            <h1>Ready to make laundry easier?</h1>
            <p>Book a service, ask a question or contact Fabroklean for help with your laundry needs.</p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-card">
              <h3>Fabroklean</h3>
              <div className="contact-row">
                <div>☎</div>
                <div><b>Phone</b><span><a href={`tel:${phone}`}>{phone}</a></span></div>
              </div>
              <div className="contact-row">
                <div>✉</div>
                <div><b>Email</b><span><a href={`mailto:${settingsData?.email || 'info@FabroKlean.com'}`}>{settingsData?.email || 'info@FabroKlean.com'}</a></span></div>
              </div>
              <div className="contact-row">
                <div>⌖</div>
                <div><b>Location</b><span style={{whiteSpace: 'pre-wrap'}}>{contactData?.address || 'Opp to Fire Station, Ballari, 583104, Karnataka'}</span></div>
              </div>
              
              {contactData?.hours && (
                <div className="contact-row" style={{marginTop: '15px'}}>
                  <div>⏱</div>
                  <div><b>Working Hours</b><span>{contactData.hours}</span></div>
                </div>
              )}

              {(contactData?.instagram || contactData?.facebook || contactData?.twitter) && (
                <div style={{marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--line)'}}>
                  <h4 style={{margin: '0 0 10px', fontSize: '15px'}}>Follow Us</h4>
                  <div style={{display: 'flex', gap: '15px'}}>
                    {contactData?.instagram && <a href={contactData.instagram} target="_blank" rel="noopener noreferrer" style={{color: '#0ea5e9', fontWeight: 'bold'}}>Instagram</a>}
                    {contactData?.facebook && <a href={contactData.facebook} target="_blank" rel="noopener noreferrer" style={{color: '#0ea5e9', fontWeight: 'bold'}}>Facebook</a>}
                    {contactData?.twitter && <a href={contactData.twitter} target="_blank" rel="noopener noreferrer" style={{color: '#0ea5e9', fontWeight: 'bold'}}>Twitter</a>}
                  </div>
                </div>
              )}

              <div className="actions" style={{marginTop: '30px'}}>
                <a className="btn btn-primary" href={`tel:${phone}`}>Call Now</a>
                <a className="btn btn-light" target="_blank" rel="noopener noreferrer" href={settingsData?.mapUrl || "https://www.google.com/maps/search/?api=1&query=Fabroklean%2C%20Opp%20to%20Fire%20Station%2C%20Ballari%2C%20583104%2C%20Karnataka"}>Get Directions</a>
              </div>
            </div>
            
            <div className="form-card">
              <form className="form" onSubmit={submitForm}>
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" required placeholder="+91" />
                </div>
                <div className="field full">
                  <label htmlFor="service">Service</label>
                  <input id="service" name="service" placeholder="e.g. Dry Cleaning" />
                </div>
                <div className="field full">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" placeholder="Tell us what you need..."></textarea>
                </div>
                <div className="field full">
                  <button className="btn btn-primary" type="submit">Continue on WhatsApp →</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
