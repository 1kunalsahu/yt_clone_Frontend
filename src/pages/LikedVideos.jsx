import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import VideoCard from '../components/VideoCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';
import { apiError } from '../api/http.js';

export default function LikedVideos() { const [state, setState] = useState({ loading: true, error: '', items: [], meta: {} }); const load = async (page = 1) => { try { const result = await api.likes.videos({ page, limit: 12 }); setState({ loading: false, error: '', items: result?.videos || [], meta: result || {} }); } catch (e) { setState({ loading: false, error: apiError(e), items: [], meta: {} }); } }; useEffect(() => { load(); }, []); if (state.loading) return <Loading />; return <section className="page"><h1>Liked videos</h1><Feedback error={state.error} />{state.items.length ? <div className="video-grid">{state.items.map((video) => <VideoCard key={video._id} video={video} />)}</div> : <Empty>You have not liked any videos.</Empty>}<Pagination page={state.meta.page} totalPages={state.meta.totalPages} onChange={load} /></section>; }
