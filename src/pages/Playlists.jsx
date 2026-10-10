import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';

export default function Playlists() {
  const { user } = useAuth(); const [items, setItems] = useState([]); const [form, setForm] = useState({ name: '', description: '' }); const [state, setState] = useState({ loading: true, error: '', success: '' });
  const load = async () => { try { const data = await api.playlists.byUser(user._id); setItems(Array.isArray(data) ? data : data?.playlists || []); } catch (e) { setState((old) => ({ ...old, error: apiError(e) })); } finally { setState((old) => ({ ...old, loading: false })); } };
  useEffect(() => { load(); }, [user._id]); // eslint-disable-line react-hooks/exhaustive-deps
  const create = async (e) => { e.preventDefault(); try { await api.playlists.create(form); setForm({ name: '', description: '' }); setState({ loading: false, error: '', success: 'Playlist created.' }); load(); } catch (error) { setState((old) => ({ ...old, error: apiError(error) })); } };
  const remove = async (id) => { if (!window.confirm('Delete this playlist?')) return; try { await api.playlists.remove(id); setItems(items.filter((item) => item._id !== id)); } catch (e) { setState((old) => ({ ...old, error: apiError(e) })); } };
  if (state.loading) return <Loading />;
  return <section className="page"><div className="page-heading"><div><p className="eyebrow">Organize</p><h1>Playlists</h1></div></div><Feedback error={state.error} success={state.success} /><div className="two-column"><form className="panel stack" onSubmit={create}><h2>New playlist</h2><label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><button className="button primary">Create playlist</button></form><div className="list">{items.length ? items.map((item) => <article className="list-item" key={item._id}><div><h3><Link to={`/playlists/${item._id}`}>{item.name}</Link></h3><p className="muted">{item.description || 'No description'} · {item.videos?.length || 0} videos</p></div><button className="button danger" onClick={() => remove(item._id)}>Delete</button></article>) : <Empty>No playlists yet.</Empty>}</div></div></section>;
}
