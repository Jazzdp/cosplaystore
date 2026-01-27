import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({ email: '', fullName: '', phone : '' });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('Please login to access account settings');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile({ email: data.email || '', fullName: data.fullName || '', phone: data.phone || '' });
        
      } catch (err) {
        setError(String(err));
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem('jwt');
    if (!token) {
      setError('Not authenticated');
      setSaving(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to save');
      }
      const updated = await res.json();
      // Update localstorage user object
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, email: updated.email, fullName: updated.fullName, phone: updated.phone }));
      navigate('/');
    } catch (err) {
      setError(String(err));
    } finally { setSaving(false); }
  };

  return (
    <div style={{minHeight:'80vh',padding:'40px 20px',background:'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 50%,#fbcfe8 100%)'}}>
      <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',gap:24}}>
        <div style={{background:'white',padding:24,borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}>
          <h3>Account Settings</h3>
          {error && <div style={{background:'#fee2e2',padding:10,borderRadius:8,color:'#991b1b',margin:'12px 0'}}>{error}</div>}
          {loading ? <div>Loading...</div> : (
            <form onSubmit={handleSave}>
              <label style={{display:'block',marginBottom:8}}>Full name</label>
              <input value={profile.fullName} onChange={(e)=>setProfile({...profile, fullName:e.target.value})} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12}} />
              <label style={{display:'block',marginBottom:8}}>Email</label>
              <input value={profile.email} onChange={(e)=>setProfile({...profile, email:e.target.value})} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12}} />
              <label style={{display:'block',marginBottom:8}}>Phone Number</label>
              <input value={profile.phone} onChange={(e)=>setProfile({...profile, phone:e.target.value})} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:12}} />
              <label style={{display:'block',marginBottom:8}}>Change password (optional)</label>
              <input type="password" placeholder="New password" onChange={(e)=>setProfile({...profile, password:e.target.value})} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e5e7eb',marginBottom:16}} />
              <button type="submit" disabled={saving} style={{padding:12,background:'linear-gradient(135deg,#ec4899,#be185d)',color:'white',border:'none',borderRadius:10,fontWeight:700}}>{saving ? 'Saving...' : 'Save changes'}</button>
            </form>
          )}
        </div>

        <aside style={{background:'white',padding:20,borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}>
          <h4 style={{marginBottom:8}}>Profile</h4>
          <p style={{color:'#6b7280'}}>Update your name,phone number, email or password here. Changes will be applied to your account immediately.</p>
        </aside>
      </div>
    </div>
  );
}