import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import VideoCard from '../components/VideoCard.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';
import { apiError } from '../api/http.js';

export default function History() { const [items, setItems] = useState([]); const [error, setError] = useState(''); useEffect(() => { api.auth.history().then(setItems).catch((e) => setError(apiError(e))); }, []); if (error) return <Feedback error={error} />; if (!items.length) return <section className="page"><h1>Watch history</h1><Empty>Your watch history is empty.</Empty></section>; return <section className="page"><h1>Watch history</h1><div className="video-grid">{items.map((video) => <VideoCard key={video._id} video={video} />)}</div></section>; }
