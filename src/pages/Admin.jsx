import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './Admin.css';
import ImageUpload from '../components/ImageUpload';

function Admin() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homepage');

  // Content States
  const [homepage, setHomepage] = useState({ name: '', operator: '', headline: '', address: '', bannerImage: '' });
  const [about, setAbout] = useState({ headline: '', paragraph: '', heroImage: '' });
  const [contact, setContact] = useState({ address: '', hours: '', instagram: '', facebook: '', twitter: '' });
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [settings, setSettings] = useState({ phone: '', email: '', mapUrl: '', emergency: '', logo: '' });
  
  // Blog States
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');

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
      const homeDoc = await getDoc(doc(db, 'content', 'homepage'));
      if (homeDoc.exists()) setHomepage(homeDoc.data());

      const aboutDoc = await getDoc(doc(db, 'content', 'about'));
      if (aboutDoc.exists()) setAbout(aboutDoc.data());

      const contactDoc = await getDoc(doc(db, 'content', 'contact'));
      if (contactDoc.exists()) setContact(contactDoc.data());

      const servDoc = await getDoc(doc(db, 'content', 'services'));
      if (servDoc.exists()) setServices(servDoc.data().items || []);

      const docDoc = await getDoc(doc(db, 'content', 'doctors'));
      if (docDoc.exists()) setDoctors(docDoc.data().items || []);

      const setDocRef = await getDoc(doc(db, 'content', 'settings'));
      if (setDocRef.exists()) setSettings(setDocRef.data());

      const querySnapshot = await getDocs(collection(db, 'blogs'));
      const postsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPosts(postsData.sort((a, b) => b.date - a.date)); // Sort newest first
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

  const saveAbout = async () => {
    await setDoc(doc(db, 'content', 'about'), about);
    alert("About page saved!");
  };

  const saveContact = async () => {
    await setDoc(doc(db, 'content', 'contact'), contact);
    alert("Contact page saved!");
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
      const excerpt = content.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
      
      if (editingPostId) {
        await updateDoc(doc(db, 'blogs', editingPostId), {
          title,
          content,
          thumbnail,
          excerpt,
          // We intentionally do not update the date so it keeps its original publish date
        });
        alert("Post updated successfully!");
      } else {
        await addDoc(collection(db, 'blogs'), {
          title,
          content,
          thumbnail,
          excerpt,
          date: Timestamp.now()
        });
        alert("Post created successfully!");
      }

      setTitle('');
      setContent('');
      setThumbnail('');
      setIsCreatingPost(false);
      setEditingPostId(null);
      fetchAllData();
    } catch (error) {
      alert("Error saving post. Check console.");
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setThumbnail(post.thumbnail || '');
    setIsCreatingPost(true);
  };

  const cancelEdit = () => {
    setIsCreatingPost(false);
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setThumbnail('');
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this post?")) {
      await deleteDoc(doc(db, 'blogs', id));
      fetchAllData();
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading...</div>;

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2 style={{marginTop: 0, textAlign: 'center'}}>Admin Login</h2>
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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span className="brandmark" style={{ width: '32px', height: '32px', fontSize: '18px' }}>F</span>
          <h2 style={{ color: '#fff', fontSize: '22px', margin: 0 }}>Fabroklean</h2>
        </div>
        <p>CMS Dashboard</p>
        
        <nav className="admin-nav">
          <a href="#" className={activeTab === 'homepage' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('homepage');}}>🏠 Homepage</a>
          <a href="#" className={activeTab === 'about' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('about');}}>ℹ️ About Us</a>
          <a href="#" className={activeTab === 'contact' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('contact');}}>📞 Contact Us</a>
          <a href="#" className={activeTab === 'services' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('services');}}>✨ Services</a>
          <a href="#" className={activeTab === 'doctors' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('doctors');}}>👥 Team Members</a>
          <a href="#" className={activeTab === 'blog' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('blog');}}>📝 Blog Posts</a>
          <a href="#" className={activeTab === 'settings' ? 'active' : ''} onClick={(e) => {e.preventDefault(); setActiveTab('settings');}}>⚙️ Global Settings</a>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </nav>
      </aside>
      
      <main className="admin-content">
        
        {/* HOMEPAGE TAB */}
        {activeTab === 'homepage' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Homepage Content</h2>
            </div>
            <div className="field full"><label>Hospital / Brand Name</label><input value={homepage.name || ''} onChange={e => setHomepage({...homepage, name: e.target.value})} /></div>
            <div className="field full"><label>Operator / Sub-brand</label><input value={homepage.operator || ''} onChange={e => setHomepage({...homepage, operator: e.target.value})} /></div>
            <div className="field full"><label>Hero Headline</label><input value={homepage.headline || ''} onChange={e => setHomepage({...homepage, headline: e.target.value})} /></div>
            <div className="field full"><label>Address</label><textarea value={homepage.address || ''} onChange={e => setHomepage({...homepage, address: e.target.value})} style={{minHeight: '80px'}} /></div>
            
            <ImageUpload label="Hero Banner Image" onUploadSuccess={(url) => setHomepage({...homepage, bannerImage: url})} />
            {homepage.bannerImage && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Current Banner:</p>
                <img src={homepage.bannerImage} alt="Banner" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            )}

            <button className="btn btn-primary" onClick={saveHomepage} style={{marginTop: '30px'}}>Save Homepage</button>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>About Us Page</h2>
            </div>
            <div className="field full"><label>Headline</label><input value={about.headline || ''} onChange={e => setAbout({...about, headline: e.target.value})} placeholder="e.g. Your local laundry partner in Ballari." /></div>
            <div className="field full"><label>Main Paragraph</label><textarea value={about.paragraph || ''} onChange={e => setAbout({...about, paragraph: e.target.value})} style={{minHeight: '120px'}} placeholder="Write about your company history and mission..." /></div>
            
            <ImageUpload label="About Page Hero Image" onUploadSuccess={(url) => setAbout({...about, heroImage: url})} />
            {about.heroImage && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Current Image:</p>
                <img src={about.heroImage} alt="About Hero" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            )}
            <button className="btn btn-primary" onClick={saveAbout} style={{marginTop: '30px'}}>Save About Page</button>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Contact Page Details</h2>
            </div>
            <div className="field full"><label>Office Address (Detailed)</label><textarea value={contact.address || ''} onChange={e => setContact({...contact, address: e.target.value})} style={{minHeight: '80px'}} placeholder="Full physical address for the contact page" /></div>
            <div className="field full"><label>Working Hours</label><input value={contact.hours || ''} onChange={e => setContact({...contact, hours: e.target.value})} placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM" /></div>
            <h3 style={{ marginTop: '30px', color: '#334155' }}>Social Media Links</h3>
            <div className="field full"><label>Instagram URL</label><input value={contact.instagram || ''} onChange={e => setContact({...contact, instagram: e.target.value})} placeholder="https://instagram.com/..." /></div>
            <div className="field full"><label>Facebook URL</label><input value={contact.facebook || ''} onChange={e => setContact({...contact, facebook: e.target.value})} placeholder="https://facebook.com/..." /></div>
            <div className="field full"><label>Twitter/X URL</label><input value={contact.twitter || ''} onChange={e => setContact({...contact, twitter: e.target.value})} placeholder="https://twitter.com/..." /></div>
            <button className="btn btn-primary" onClick={saveContact} style={{marginTop: '30px'}}>Save Contact Page</button>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Global Settings</h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>These settings appear in the navigation bar and footer across the whole site.</p>
            <div className="field full"><label>Emergency / Urgent Number</label><input value={settings.emergency || ''} onChange={e => setSettings({...settings, emergency: e.target.value})} /></div>
            <div className="field full"><label>General Phone</label><input value={settings.phone || ''} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
            <div className="field full"><label>Email Address</label><input value={settings.email || ''} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
            <div className="field full"><label>Google Maps Embed URL</label><input value={settings.mapUrl || ''} onChange={e => setSettings({...settings, mapUrl: e.target.value})} /></div>
            
            <ImageUpload label="Website Logo (Navbar & Footer)" onUploadSuccess={(url) => setSettings({...settings, logo: url})} />
            {settings.logo && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '14px', color: '#64748b' }}>Current Logo:</p>
                <img src={settings.logo} alt="Logo" style={{ maxHeight: '60px', objectFit: 'contain', borderRadius: '4px' }} />
              </div>
            )}

            <button className="btn btn-primary" onClick={saveSettings} style={{marginTop: '30px'}}>Save Settings</button>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Services</h2>
              <button className="btn btn-primary" onClick={() => setServices([...services, { title: '', desc: '', icon: '', image: '' }])}>+ Add Service</button>
            </div>
            
            {services.map((srv, idx) => (
              <div key={idx} className="list-item-card">
                <div className="flex-row">
                  <div className="field full"><label>Title</label><input value={srv.title} onChange={e => {const s = [...services]; s[idx].title = e.target.value; setServices(s);}} /></div>
                  <div className="field"><label>Icon (Emoji)</label><input value={srv.icon} onChange={e => {const s = [...services]; s[idx].icon = e.target.value; setServices(s);}} /></div>
                </div>
                <div className="field full"><label>Description</label><textarea value={srv.desc} onChange={e => {const s = [...services]; s[idx].desc = e.target.value; setServices(s);}} style={{minHeight: '80px'}} /></div>
                
                <ImageUpload label="Service Background Image" onUploadSuccess={(url) => {const s = [...services]; s[idx].image = url; setServices(s);}} />
                {srv.image && <img src={srv.image} alt="Service" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
                
                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                  <button className="btn btn-danger" onClick={() => {const s = [...services]; s.splice(idx, 1); setServices(s);}}>Remove Service</button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" onClick={saveServices} style={{marginTop: '20px'}}>Save Services</button>
          </div>
        )}

        {/* DOCTORS TAB */}
        {activeTab === 'doctors' && (
          <div className="admin-panel">
            <div className="admin-panel-header">
              <h2>Team Members</h2>
              <button className="btn btn-primary" onClick={() => setDoctors([...doctors, { name: '', role: '', desc: '', image: '' }])}>+ Add Member</button>
            </div>
            
            {doctors.map((docItem, idx) => (
              <div key={idx} className="list-item-card">
                <div className="flex-row">
                  <div className="field full"><label>Name</label><input value={docItem.name} onChange={e => {const d = [...doctors]; d[idx].name = e.target.value; setDoctors(d);}} /></div>
                  <div className="field full"><label>Role / Specialty</label><input value={docItem.role} onChange={e => {const d = [...doctors]; d[idx].role = e.target.value; setDoctors(d);}} /></div>
                </div>
                <div className="field full"><label>Description</label><textarea value={docItem.desc} onChange={e => {const d = [...doctors]; d[idx].desc = e.target.value; setDoctors(d);}} style={{minHeight: '80px'}} /></div>
                
                <ImageUpload label="Profile Photo" onUploadSuccess={(url) => {const d = [...doctors]; d[idx].image = url; setDoctors(d);}} />
                {docItem.image && <img src={docItem.image} alt="Profile" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '40px', marginTop: '10px' }} />}

                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                  <button className="btn btn-danger" onClick={() => {const d = [...doctors]; d.splice(idx, 1); setDoctors(d);}}>Remove Member</button>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" onClick={saveDoctors} style={{marginTop: '20px'}}>Save Team</button>
          </div>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && (
          <div className="admin-panel">
            {isCreatingPost ? (
              <div>
                <div className="admin-panel-header">
                  <h2>{editingPostId ? 'Edit Post' : 'Write New Post'}</h2>
                  <button className="btn btn-light" onClick={cancelEdit}>Cancel</button>
                </div>
                
                <div className="field full" style={{marginBottom: '20px'}}>
                  <label>Post Title</label>
                  <input placeholder="Enter title here..." value={title} onChange={(e) => setTitle(e.target.value)} style={{fontSize: '18px'}} />
                </div>
                
                <ImageUpload label="Blog Cover Image" onUploadSuccess={(url) => setThumbnail(url)} />
                {thumbnail && <img src={thumbnail} alt="Thumbnail" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} />}

                <div className="editor-container">
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Content</label>
                  <ReactQuill theme="snow" value={content} onChange={setContent} />
                </div>
                <button className="btn btn-primary" onClick={handlePublishPost} style={{marginTop: '30px'}}>
                  {editingPostId ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            ) : (
              <div>
                <div className="admin-panel-header">
                  <h2>Manage Blog Posts</h2>
                  <button className="btn btn-primary" onClick={() => setIsCreatingPost(true)}>+ Write New Post</button>
                </div>
                
                {posts.length === 0 ? (
                  <div style={{padding: '60px 40px', textAlign: 'center', border: '2px dashed #cbd5e1', borderRadius: '16px', background: '#f8fafc'}}>
                    <p style={{color: '#64748b', margin: 0, fontSize: '16px'}}>No blog posts published yet.</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '20px'}}>
                    {posts.map(post => (
                      <div key={post.id} className="blog-post-card">
                        <div className="blog-post-info">
                          {post.thumbnail ? (
                            <img src={post.thumbnail} alt="thumb" className="blog-post-thumb" />
                          ) : (
                            <div className="blog-post-no-thumb">No Image</div>
                          )}
                          <div>
                            <h4 style={{margin: '0 0 5px', fontSize: '18px', color: '#0f172a'}}>{post.title}</h4>
                            <span style={{fontSize: '13px', color: '#64748b'}}>Published on {post.date?.toDate().toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="blog-post-actions">
                          <button className="btn btn-outline-primary" onClick={() => handleEditPost(post)}>Edit</button>
                          <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Admin;
