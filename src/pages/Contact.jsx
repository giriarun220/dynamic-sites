import React from 'react';

function Contact() {
  const submitForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = `Hi Fabroklean, I would like to book a service.%0A%0AName: ${encodeURIComponent(formData.get('name'))}%0APhone: ${encodeURIComponent(formData.get('phone'))}%0AService: ${encodeURIComponent(formData.get('service'))}%0AMessage: ${encodeURIComponent(formData.get('message'))}`;
    window.open(`https://wa.me/919449422175?text=${text}`, '_blank');
  };

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
                <div><b>Phone</b><span><a href="tel:+919449422175">+91 9449422175</a></span></div>
              </div>
              <div className="contact-row">
                <div>✉</div>
                <div><b>Email</b><span><a href="mailto:info@FabroKlean.com">info@FabroKlean.com</a></span></div>
              </div>
              <div className="contact-row">
                <div>⌖</div>
                <div><b>Location</b><span>Opp to Fire Station, Ballari, 583104, Karnataka</span></div>
              </div>
              <div className="actions">
                <a className="btn btn-primary" href="tel:+919449422175">Call Now</a>
                <a className="btn btn-light" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=Fabroklean%2C%20Opp%20to%20Fire%20Station%2C%20Ballari%2C%20583104%2C%20Karnataka">Get Directions</a>
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
