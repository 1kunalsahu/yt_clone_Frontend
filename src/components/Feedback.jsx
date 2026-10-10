export function Feedback({ error, success }) {
  if (!error && !success) return null;
  return <div className={error ? 'feedback error' : 'feedback success'} role={error ? 'alert' : 'status'}>{error || success}</div>;
}

export function Loading({ label = 'Loading…' }) { return <div className="loading" role="status">{label}</div>; }

export function Empty({ children = 'Nothing here yet.' }) { return <div className="empty">{children}</div>; }
