import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData.sort((a, b) => b.date - a.date)); // Sort newest first
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main style={{background: '#f1f8fc', minHeight: '80vh', paddingBottom: '100px'}}>
      <section style={{paddingTop: '60px', paddingBottom: '40px', background: '#fff', borderBottom: '1px solid var(--line)'}}>
        <div className="container">
          <span className="kicker">Fabroklean Blog</span>
          <h1 style={{margin: '10px 0'}}>Laundry Tips & Insights.</h1>
          <p style={{color: 'var(--muted)'}}>Expert advice on fabric care, stain removal, and maintaining your wardrobe.</p>
        </div>
      </section>

      <section style={{paddingTop: '60px'}}>
        <div className="container">
          {loading ? (
            <div style={{textAlign: 'center', padding: '50px'}}>Loading articles...</div>
          ) : posts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '24px'}}>
              <p style={{color: 'var(--muted)'}}>No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'}}>
              {posts.map(post => (
                <div key={post.id} style={{background: '#fff', padding: '30px', borderRadius: '24px', border: '1px solid var(--line)', boxShadow: '0 10px 35px rgba(8,47,73,.05)'}}>
                  <span style={{fontSize: '12px', color: '#0788c6', fontWeight: 800, textTransform: 'uppercase'}}>
                    {post.date?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <h3 style={{fontSize: '22px', margin: '10px 0'}}>{post.title}</h3>
                  <p style={{color: 'var(--muted)', fontSize: '15px'}}>{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} style={{color: 'var(--blue)', fontWeight: 700, fontSize: '14px', marginTop: '15px', display: 'inline-block'}}>Read Article →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Blog;
