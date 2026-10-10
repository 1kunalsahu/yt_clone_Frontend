import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import { apiError } from '../api/http.js';
import VideoCard from '../components/VideoCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { Empty, Feedback, Loading } from '../components/Feedback.jsx';

export default function Videos() {
  const [videos, setVideos] = useState([]); const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [query, setQuery] = useState(''); const [sortBy, setSortBy] = useState('createdAt'); const [page, setPage] = useState(1); const [state, setState] = useState({ loading: true, error: '' });
  const load = async (nextPage = page) => { setState({ loading: true, error: '' }); try { const result = await api.videos.list({ page: nextPage, limit: 12, query: query || undefined, sortBy }); setVideos(result?.videos || []); setMeta(result || {}); setPage(nextPage); } catch (error) { setState({ loading: false, error: apiError(error) }); } finally { setState((old) => ({ ...old, loading: false })); } };
  useEffect(() => { load(1); }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps
  return <section className="page"><div className="page-heading"><div><p className="eyebrow">Explore</p><h1>Videos</h1></div><div className="search-row"><input aria-label="Search videos" placeholder="Search videos…" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(1)} /><select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="createdAt">Newest</option><option value="views">Most viewed</option><option value="title">Title</option></select><button className="button primary" onClick={() => load(1)}>Search</button></div></div>
    <Feedback error={state.error} />{state.loading ? <Loading /> : videos.length ? <div className="video-grid">{videos.map((video) => <VideoCard key={video._id} video={video} />)}</div> : <Empty>No published videos match your search.</Empty>}<Pagination page={meta.page || page} totalPages={meta.totalPages} onChange={load} />
  </section>;
}
