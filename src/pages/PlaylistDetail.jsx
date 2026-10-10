import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';

export default function PlaylistDetail() {
  const { playlistId } = useParams(); const [playlist, setPlaylist] = useState(null); const [edit, setEdit] = useState(false); const [form, setForm] = useState({ name: '', description: '' }); const [error, setError] = useState('');
  const load = async () => { try { const data = await api.playlists.get(playlistId); setPlaylist(data); setForm({ name: data.name, description: data.description || '' }); } catch (e) { setError(apiError(e)); } }; useEffect(() => { load(); }, [playlistId]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async (e) => { e.preventDefault(); try { setPlaylist(await api.playlists.update(playlistId, form)); setEdit(false); } catch (e) { setError(apiError(e)); } };
  const remove = async (id) => { try { setPlaylist(await api.playlists.removeVideo(id, playlistId)); } catch (e) { setError(apiError(e)); } };
  if (!playlist) return error ? <Feedback error={error} /> : <Loading />;
  return <section className="page"><Feedback error={error} /><div className="page-heading"><div><p className="eyebrow">Playlist</p><h1>{playlist.name}</h1><p className="muted">{playlist.description}</p></div><button className="button" onClick={() => setEdit(!edit)}>Edit playlist</button></div>{edit && <form className="panel form-grid" onSubmit={save}><label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Description<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><button className="button primary">Save</button></form>}<div className="video-grid">{playlist.videos?.length ? playlist.videos.map((video) => <article className="video-card" key={video._id}><Link to={`/videos/${video._id}`}><img className="thumbnail" src={video.thumbnail} alt="" /></Link><div className="card-body"><h3><Link to={`/videos/${video._id}`}>{video.title}</Link></h3><button className="button danger" onClick={() => remove(video._id)}>Remove</button></div></article>) : <Empty>This playlist has no videos.</Empty>}</div></section>;
}
