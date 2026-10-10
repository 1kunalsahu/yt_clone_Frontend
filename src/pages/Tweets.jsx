import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';

export default function Tweets() {
  const { user } = useAuth(); const [tweets, setTweets] = useState([]); const [content, setContent] = useState(''); const [editing, setEditing] = useState(null); const [liked, setLiked] = useState({}); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = async () => { try { setTweets(await api.tweets.byUser(user._id) || []); } catch (e) { setError(apiError(e)); } finally { setLoading(false); } }; useEffect(() => { load(); }, [user._id]); // eslint-disable-line react-hooks/exhaustive-deps
  const create = async (e) => { e.preventDefault(); try { const created = await api.tweets.create({ content }); setTweets([created, ...tweets]); setContent(''); } catch (e) { setError(apiError(e)); } };
  const remove = async (id) => { if (!window.confirm('Delete this tweet?')) return; try { await api.tweets.remove(id); setTweets(tweets.filter((tweet) => tweet._id !== id)); } catch (e) { setError(apiError(e)); } };
  const save = async (id) => { try { const updated = await api.tweets.update(id, { content: editing.content }); setTweets(tweets.map((tweet) => tweet._id === id ? updated : tweet)); setEditing(null); } catch (e) { setError(apiError(e)); } };
  const toggleLike = async (id) => { try { const result = await api.likes.tweet(id); setLiked({ ...liked, [id]: result?.liked }); } catch (e) { setError(apiError(e)); } };
  if (loading) return <Loading />;
  return <section className="page narrow"><p className="eyebrow">Community</p><h1>Tweets</h1><Feedback error={error} /><form className="panel stack" onSubmit={create}><textarea required maxLength="280" placeholder="Share an update…" value={content} onChange={(e) => setContent(e.target.value)} /><button className="button primary">Post tweet</button></form><div className="list">{tweets.length ? tweets.map((tweet) => <article className="tweet" key={tweet._id}>{editing?._id === tweet._id ? <div className="stack"><textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /><div className="inline-actions"><button className="button primary" onClick={() => save(tweet._id)}>Save</button><button className="button subtle" onClick={() => setEditing(null)}>Cancel</button></div></div> : <><p>{tweet.content}</p><small className="muted">{new Date(tweet.createdAt).toLocaleString()}</small><div className="inline-actions"><button className="button subtle" onClick={() => toggleLike(tweet._id)}>{liked[tweet._id] ? '♥ Liked' : '♡ Like'}</button><button className="button subtle" onClick={() => setEditing(tweet)}>Edit</button><button className="button danger" onClick={() => remove(tweet._id)}>Delete</button></div></>}</article>) : <Empty>No tweets yet.</Empty>}</div></section>;
}
