import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');

  // Content States
  const [homepage, setHomepage] = useState({ name: '', operator: '', headline: '', address: '' });
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [settings, setSettings] = useState({ phone: '', email: '', mapUrl: '', emergency: '' });
  
  // Blog States
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch Homepage
      const homeDoc = await getDoc(doc(db, 'content', 'homepage'));
      if (homeDoc.exists()) setHomepage(homeDoc.data());

      // Fetch Services
      const servDoc = await getDoc(doc(db, 'content', 'services'));
      if (servDoc.exists()) setServices(servDoc.data().items || []);

      // Fetch Doctors
      const docDoc = await getDoc(doc(db, 'content', 'doctors'));
      if (docDoc.exists()) setDoctors(docDoc.data().items || []);

      // Fetch Settings
      const setDocRef = await getDoc(doc(db, 'content', 'settings'));
      if (setDocRef.exists()) setSettings(setDocRef.data());

      // Fetch Blogs
      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const postsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === 'admin' && password === 'Admin@123') {
      setUser({ email: 'admin' });
      setLoading(false);
      fetchAllData();
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid login. Default is admin / Admin@123");
    }
  };

  const handleLogout = async () => {
    if (user?.email === 'admin') {
      setUser(null);
    } else {
      await signOut(auth);
    }
  };

  // --- SAVE HANDLERS ---
  const saveHomepage = async () => {
    await setDoc(doc(db, 'content', 'homepage'), homepage);
    alert("Homepage saved!");
  };

  const saveSettings = async () => {
    await setDoc(doc(db, 'content', 'settings'), settings);
    alert("Settings saved!");
  };

  const saveServices = async () => {
    await setDoc(doc(db, 'content', 'services'), { items: services });
    alert("Services saved!");
  };

  const saveDoctors = async () => {
    await setDoc(doc(db, 'content', 'doctors'), { items: doctors });
    alert("Doctors saved!");
  };

  const handlePublishPost = async () => {
    if (!title || !content) return alert("Title and content required!");
    try {
      await addDoc(collection(db, 'blogs'), {
        title,
        content,
        date: Timestamp.now(),
        excerpt: content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
      });
      setTitle('');
      setContent('');
      setIsCreatingPost(false);
      fetchAllData();
    } catch (error) {
      alert("Error publishing post. Check console.");
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Delete this post?")) {
      await deleteDoc(doc(db, 'blogs', id));
      fetchAllData();
    }
  };

  // --- RENDERERS ---
  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading...</div>;

  if (!user) {
    return (
      <div className="container" style={{ padding: '100px 0', maxWidth: '400px' }}>
        <div className="form-card">
          <h2 style={{marginTop: 0}}>Admin Login</h2>
          <form className="form" onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column'}}>
            <div className="field full">
              <label>Username or Email</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field full">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="field full" style={{marginTop: '12px'}}>
              <button className="btn btn-primary" style={{width: '100%'}} type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container admin-container">
      <div className="admin-grid">
        <aside className="admin-sidebar">
          <h3>CMS Admin</h3>
          <p style={{fontSize: '12px', color: 'var(--muted)', marginTop: '-10px'}}>Fabroklean Website</p>
          <nav className="admin-nav">
            <a href="#" className={activeTab === 'homepage' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('homepage');}}>Homepage</a>
            <a href="#" className={activeTab === 'services' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('services');}}>Services</a>
            <a href="#" className={activeTab === 'doctors' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('doctors');}}>Doctors / Team</a>
            <a href="#" className={activeTab === 'settings' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('settings');}}>Global Settings</a>
            <a href="#" className={activeTab === 'blog' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('blog');}}>Blog Posts</a>
            <button className="btn btn-light" style={{marginTop: '24px'}} onClick={handleLogout}>Logout</button>
          </nav>
        </aside>
        
        <main className="admin-content">
          
          {/* HOMEPAGE TAB */}
          {activeTab === 'homepage' && (
            <div>
              <h2>Homepage Content</h2>
              <div className="field full"><label>Hospital / Brand Name</label><input value={homepage.name || ''} onChange={e => setHomepage({...homepage, name: e.target.value})} /></div>
              <div className="field full"><label>Operator / Sub-brand</label><input value={homepage.operator || ''} onChange={e => setHomepage({...homepage, operator: e.target.value})} /></div>
              <div className="field full"><label>Hero Headline</label><input value={homepage.headline || ''} onChange={e => setHomepage({...homepage, headline: e.target.value})} /></div>
              <div className="field full"><label>Address</label><textarea value={homepage.address || ''} onChange={e => setHomepage({...homepage, address: e.target.value})} style={{minHeight: '80px'}} /></div>
              <button className="btn btn-primary" onClick={saveHomepage} style={{marginTop: '15px'}}>Save Homepage</button>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <h2>Global Settings</h2>
              <div className="field full"><label>Emergency Number</label><input value={settings.emergency || ''} onChange={e => setSettings({...settings, emergency: e.target.value})} /></div>
              <div className="field full"><label>General Phone</label><input value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
              <div className="field full"><label>Email Address</label><input value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
              <div className="field full"><label>Google Maps URL</label><input value={settings.mapUrl || ''} onChange={e => setSettings({...settings, mapUrl: e.target.value})} /></div>
              <button className="btn btn-primary" onClick={saveSettings} style={{marginTop: '15px'}}>Save Settings</button>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Services</h2>
                <button className="btn btn-light" onClick={() => setServices([...services, { title: '', desc: '', icon: '' }])}>+ Add Service</button>
              </div>
              {services.map((srv, idx) => (
                <div key={idx} style={{border: '1px solid var(--line)', padding: '20px', borderRadius: '12px', marginBottom: '15px'}}>
                  <div style={{display: 'flex', gap: '15px', marginBottom: '10px'}}>
                    <div className="field full"><label>Title</label><input value={srv.title} onChange={e => {const s = [...services]; s[idx].title = e.target.value; setServices(s);}} /></div>
                    <div className="field"><label>Icon (Emoji/Text)</label><input value={srv.icon} onChange={e => {const s = [...services]; s[idx].icon = e.target.value; setServices(s);}} /></div>
                  </div>
                  <div className="field full"><label>Description</label><textarea value={srv.desc} onChange={e => {const s = [...services]; s[idx].desc = e.target.value; setServices(s);}} /></div>
                  <button className="btn btn-light" style={{color: 'red', marginTop: '10px'}} onClick={() => {const s = [...services]; s.splice(idx, 1); setServices(s);}}>Remove</button>
                </div>
              ))}
              <button className="btn btn-primary" onClick={saveServices} style={{marginTop: '15px'}}>Save Services</button>
            </div>
          )}

          {/* DOCTORS TAB */}
          {activeTab === 'doctors' && (
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Doctors / Team</h2>
                <button className="btn btn-light" onClick={() => setDoctors([...doctors, { name: '', role: '', desc: '' }])}>+ Add Member</button>
              </div>
              {doctors.map((doc, idx) => (
                <div key={idx} style={{border: '1px solid var(--line)', padding: '20px', borderRadius: '12px', marginBottom: '15px'}}>
                  <div style={{display: 'flex', gap: '15px', marginBottom: '10px'}}>
                    <div className="field full"><label>Name</label><input value={doc.name} onChange={e => {const d = [...doctors]; d[idx].name = e.target.value; setDoctors(d);}} /></div>
                    <div className="field full"><label>Role / Specialty</label><input value={doc.role} onChange={e => {const d = [...doctors]; d[idx].role = e.target.value; setDoctors(d);}} /></div>
                  </div>
                  <div className="field full"><label>Description</label><textarea value={doc.desc} onChange={e => {const d = [...doctors]; d[idx].desc = e.target.value; setDoctors(d);}} /></div>
                  <button className="btn btn-light" style={{color: 'red', marginTop: '10px'}} onClick={() => {const d = [...doctors]; d.splice(idx, 1); setDoctors(d);}}>Remove</button>
                </div>
              ))}
              <button className="btn btn-primary" onClick={saveDoctors} style={{marginTop: '15px'}}>Save Doctors</button>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            isCreatingPost ? (
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                  <h2 style={{margin: 0}}>Write New Post</h2>
                  <button className="btn btn-light" onClick={() => setIsCreatingPost(false)}>Cancel</button>
                </div>
                <div className="field full" style={{marginBottom: '15px'}}>
                  <input placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{fontSize: '20px', padding: '10px'}} />
                </div>
                <div style={{background: 'white', marginBottom: '20px'}}>
                  <ReactQuill theme="snow" value={content} onChange={setContent} style={{height: '300px', marginBottom: '50px'}} />
                </div>
                <button className="btn btn-primary" onClick={handlePublishPost}>Publish Post</button>
              </div>
            ) : (
              <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
                  <h2 style={{margin: 0}}>Manage Blog Posts</h2>
                  <button className="btn btn-primary" onClick={() => setIsCreatingPost(true)}>Write New Post</button>
                </div>
                
                {posts.length === 0 ? (
                  <div style={{padding: '40px', textAlign: 'center', border: '2px dashed var(--line)', borderRadius: '16px'}}>
                    <p style={{color: 'var(--muted)', margin: 0}}>No blog posts yet.</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '15px'}}>
                    {posts.map(post => (
                      <div key={post.id} style={{padding: '20px', border: '1px solid var(--line)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                          <h4 style={{margin: '0 0 5px'}}>{post.title}</h4>
                          <span style={{fontSize: '12px', color: 'var(--muted)'}}>Published on {post.date?.toDate().toLocaleDateString()}</span>
                        </div>
                        <button className="btn btn-light" onClick={() => handleDeletePost(post.id)} style={{color: 'red', border: 'none'}}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

        </main>
      </div>
    </div>
  );
}

export default Admin;
