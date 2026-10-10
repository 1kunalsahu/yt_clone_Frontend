import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import { apiErrorDetails } from '../api/http.js';
import { Feedback } from '../components/Feedback.jsx';
import FieldError from '../components/FieldError.jsx';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', avatar: null, coverImage: null });
  const [state, setState] = useState({ loading: false, error: '', fieldErrors: {} });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const validateForm = () => {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
    if (!/^[A-Za-z0-9]{3,30}$/.test(form.username.trim())) errors.username = 'Username must be 3–30 characters and contain only letters and numbers.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address.';
    if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
    if (!form.avatar) errors.avatar = 'Choose an avatar image.';
    return errors;
  };
  const submit = async (event) => {
    event.preventDefault();
    const fieldErrors = validateForm();
    if (Object.keys(fieldErrors).length) { setState({ loading: false, error: 'Please correct the highlighted fields.', fieldErrors }); return; }
    setState({ loading: true, error: '', fieldErrors: {} });
    try {
      const data = new FormData();
      ['fullName', 'username', 'email', 'password'].forEach((key) => data.append(key, form[key]));
      data.append('avatar', form.avatar);
      if (form.coverImage) data.append('coverImage', form.coverImage);
      await api.auth.register(data); navigate('/login');
    } catch (error) { setState({ loading: false, ...apiErrorDetails(error) }); }
  };
  return <main className="auth-page"><div className="auth-card wide"><Link className="brand" to="/login">Chai<span>Tube</span></Link><h1>Create your account</h1><p className="muted">Your avatar is required by the backend.</p><form className="stack" noValidate onSubmit={submit}>
    <Feedback error={state.error} />
    <div className="form-grid"><label>Full name<input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /><FieldError message={state.fieldErrors.fullName} /></label><label>Username<input value={form.username} onChange={(e) => update('username', e.target.value)} /><FieldError message={state.fieldErrors.username} /></label></div>
    <label>Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /><FieldError message={state.fieldErrors.email} /></label><label>Password<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} /><FieldError message={state.fieldErrors.password} /></label>
    <div className="form-grid"><label>Avatar (required)<input type="file" accept="image/*" onChange={(e) => update('avatar', e.target.files[0])} /><FieldError message={state.fieldErrors.avatar} /></label><label>Cover image<input type="file" accept="image/*" onChange={(e) => update('coverImage', e.target.files[0])} /><FieldError message={state.fieldErrors.coverImage} /></label></div>
    <button className="button primary" disabled={state.loading}>{state.loading ? 'Creating…' : 'Create account'}</button><p className="muted">Already registered? <Link to="/login">Sign in</Link></p>
  </form></div></main>;
}
