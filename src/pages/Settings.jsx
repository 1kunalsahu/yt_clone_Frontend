import { useState } from 'react';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Feedback } from '../components/Feedback.jsx';

export default function Settings() {
  const { user, setUser } = useAuth(); const [state, setState] = useState({ error: '', success: '' }); const [password, setPassword] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const updateImage = async (type, file) => { if (!file) return; try { const result = type === 'avatar' ? await api.auth.updateAvatar(file) : await api.auth.updateCover(file); setUser(result.user); setState({ error: '', success: `${type === 'avatar' ? 'Avatar' : 'Cover image'} updated.` }); } catch (e) { setState({ error: apiError(e), success: '' }); } };
  const changePassword = async (e) => { e.preventDefault(); try { await api.auth.changePassword(password); setPassword({ oldPassword: '', newPassword: '', confirmPassword: '' }); setState({ error: '', success: 'Password changed.' }); } catch (error) { setState({ error: apiError(error), success: '' }); } };
  return <section className="page narrow"><p className="eyebrow">Account</p><h1>Settings</h1><Feedback error={state.error} success={state.success} /><div className="panel stack"><h2>Profile images</h2><img className="avatar large" src={user.avatar} alt="Current avatar" /><label>Change avatar<input type="file" accept="image/*" onChange={(e) => updateImage('avatar', e.target.files[0])} /></label><label>Change cover image<input type="file" accept="image/*" onChange={(e) => updateImage('cover', e.target.files[0])} /></label></div><form className="panel stack" onSubmit={changePassword}><h2>Change password</h2><label>Current password<input required type="password" value={password.oldPassword} onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} /></label><label>New password<input required minLength="6" type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></label><label>Confirm new password<input required minLength="6" type="password" value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} /></label><button className="button primary">Change password</button></form></section>;
}
