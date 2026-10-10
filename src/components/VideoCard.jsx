import { Link } from 'react-router-dom';

export default function VideoCard({ video, onDelete, onToggle, onEdit }) {
  return <article className="video-card">
    <Link to={`/videos/${video._id}`} className="thumbnail-link">
      <img src={video.thumbnail} alt="" className="thumbnail" />
    </Link>
    <div className="card-body">
      <h3><Link to={`/videos/${video._id}`}>{video.title}</Link></h3>
      <p className="muted">{video.owner?.fullName || video.owner?.username || 'Unknown creator'}</p>
      <p className="muted">{video.views || 0} views · {video.isPublished === false ? 'Unpublished' : 'Published'}</p>
      {(onDelete || onToggle) && <div className="inline-actions">
        {onEdit && <button className="button subtle" onClick={() => onEdit(video)}>Edit</button>}
        {onToggle && <button className="button subtle" onClick={() => onToggle(video)}>{video.isPublished ? 'Unpublish' : 'Publish'}</button>}
        {onDelete && <button className="button danger" onClick={() => onDelete(video)}>Delete</button>}
      </div>}
    </div>
  </article>;
}
