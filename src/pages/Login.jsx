import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiErrorDetails } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Feedback } from '../components/Feedback.jsx';
import FieldError from '../components/FieldError.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [state, setState] = useState({ loading: false, error: '', fieldErrors: {} });
  if (user) return <Navigate to="/" replace />;
  const submit = async (event) => {
    event.preventDefault();
    const fieldErrors = {};
    if (!form.identifier.trim()) fieldErrors.identifier = 'Enter your email or username.';
    if (!form.password) fieldErrors.password = 'Enter your password.';
    if (Object.keys(fieldErrors).length) { setState({ loading: false, error: 'Please correct the highlighted fields.', fieldErrors }); return; }
    setState({ loading: true, error: '', fieldErrors: {} });
    try {
      const credentials = form.identifier.includes('@')
        ? { email: form.identifier, password: form.password }
        : { username: form.identifier, password: form.password };
      await login(credentials); navigate(location.state?.from?.pathname || '/', { replace: true });
    }
    catch (error) {
      const details = apiErrorDetails(error);
      setState({ loading: false, error: details.message || 'Sign in failed. Please check your details.', fieldErrors: details.fieldErrors || {} });
    }
  };
  return <AuthShell title="Welcome back" subtitle="Sign in to continue to ChaiTube.">
    <form className="stack" noValidate onSubmit={submit}>
      <Feedback error={state.error} />
      <label>Email or username<input value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} /><FieldError message={state.fieldErrors.identifier} /></label>
      <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><FieldError message={state.fieldErrors.password} /></label>
      <button type="submit" className="button primary" disabled={state.loading} onClick={submit}>{state.loading ? 'Signing in…' : 'Sign in'}</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </form>
  </AuthShell>;
}

function AuthShell({ title, subtitle, children }) { return <main className="auth-page"><div className="auth-card"><Link className="brand" to="/login">Chai<span>Tube</span></Link><h1>{title}</h1><p className="muted">{subtitle}</p>{children}</div></main>; }
