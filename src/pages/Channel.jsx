import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';

export default function Channel() {
  const { username } = useParams(); const { user } = useAuth(); const [channel, setChannel] = useState(null); const [videos, setVideos] = useState([]); const [subscribers, setSubscribers] = useState([]); const [channels, setChannels] = useState([]); const [error, setError] = useState('');
  const load = async () => { try { const profile = await api.auth.channel(username); setChannel(profile); const [videoResult, subscriberResult] = await Promise.all([api.videos.list({ userId: profile._id, limit: 12 }), api.subscriptions.subscribers(profile._id)]); setVideos(videoResult?.videos || []); setSubscribers(subscriberResult || []); if (user?._id === profile._id) setChannels(await api.subscriptions.channels(profile._id) || []); } catch (e) { setError(apiError(e)); } }; useEffect(() => { load(); }, [username]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = async () => { try { const result = await api.subscriptions.toggle(channel._id); setChannel({ ...channel, isSubscribed: result?.subscribed }); } catch (e) { setError(apiError(e)); } };
  if (!channel) return error ? <Feedback error={error} /> : <Loading />;
  return <section className="page"><Feedback error={error} /><div className="profile-banner" style={{ backgroundImage: channel.coverImage ? `url(${channel.coverImage})` : undefined }} /><div className="profile-head"><img src={channel.avatar} alt="" className="avatar large" /><div><h1>{channel.fullName}</h1><p className="muted">@{channel.username} · {channel.subscribersCount} subscribers · {channel.subscribedToCount} subscriptions</p></div>{user?._id !== channel._id && <button className="button primary" onClick={toggle}>{channel.isSubscribed ? 'Subscribed' : 'Subscribe'}</button>}</div><div className="subsection"><h2>Videos</h2>{videos.length ? <div className="video-grid">{videos.map((video) => <VideoCard key={video._id} video={video} />)}</div> : <Empty>No published videos.</Empty>}</div><div className="subsection"><h2>Subscribers ({subscribers.length})</h2><div className="chip-list">{subscribers.slice(0, 12).map((item) => <Link key={item._id} to={`/channel/${item.subscriber?.username}`} className="chip">{item.subscriber?.fullName || item.subscriber?.username}</Link>)}</div></div>{user?._id === channel._id && <div className="subsection"><h2>Subscribed channels</h2><div className="chip-list">{channels.map((item) => <Link key={item._id} to={`/channel/${item.channel?.username}`} className="chip">{item.channel?.fullName || item.channel?.username}</Link>)}</div></div>}</section>;
}
