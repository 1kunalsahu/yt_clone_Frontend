import { request } from './http.js';

const json = (method, url, data, params) => request({ method, url, data, params });

export const api = {
  health: () => json('get', '/healthcheck'),
  auth: {
    register: (data) => request({ method: 'post', url: '/users/register', data }),
    login: (data) => json('post', '/users/login', data),
    logout: () => json('post', '/users/logout'),
    refresh: () => json('post', '/users/refresh-token'),
    current: async () => {
      const body = await request({ method: 'get', url: '/users/currentUser' });
      return body?.user || body;
    },
    changePassword: (data) => json('post', '/users/change/Password', data),
    updateAvatar: (file) => upload('/users/change-avatar', 'avatar', file),
    updateCover: (file) => upload('/users/cover-Image', 'coverImage', file),
    channel: (username) => json('get', `/users/c/${encodeURIComponent(username)}`),
    history: () => json('get', '/users/history'),
  },
  videos: {
    list: (params) => json('get', '/videos', undefined, params),
    get: (id) => json('get', `/videos/${id}`),
    publish: (data) => uploadMany('/videos', data),
    update: (id, data) => upload(`/videos/${id}`, 'thumbnail', data.thumbnail, { title: data.title, description: data.description }),
    remove: (id) => json('delete', `/videos/${id}`),
    togglePublish: (id) => json('patch', `/videos/toggle/publish/${id}`),
  },
  comments: {
    list: (videoId, params) => json('get', `/comments/${videoId}`, undefined, params),
    add: (videoId, data) => json('post', `/comments/${videoId}`, data),
    update: (id, data) => json('patch', `/comments/c/${id}`, data),
    remove: (id) => json('delete', `/comments/c/${id}`),
  },
  likes: {
    video: (id) => json('post', `/likes/toggle/v/${id}`),
    comment: (id) => json('post', `/likes/toggle/c/${id}`),
    tweet: (id) => json('post', `/likes/toggle/t/${id}`),
    videos: (params) => json('get', '/likes/videos', undefined, params),
  },
  playlists: {
    create: (data) => json('post', '/playlist', data),
    get: (id) => json('get', `/playlist/${id}`),
    update: (id, data) => json('patch', `/playlist/${id}`, data),
    remove: (id) => json('delete', `/playlist/${id}`),
    addVideo: (videoId, playlistId) => json('patch', `/playlist/add/${videoId}/${playlistId}`),
    removeVideo: (videoId, playlistId) => json('patch', `/playlist/remove/${videoId}/${playlistId}`),
    byUser: (userId, params) => json('get', `/playlist/user/${userId}`, undefined, params),
  },
  tweets: {
    create: (data) => json('post', '/tweets', data),
    byUser: (userId) => json('get', `/tweets/user/${userId}`),
    update: (id, data) => json('patch', `/tweets/${id}`, data),
    remove: (id) => json('delete', `/tweets/${id}`),
  },
  subscriptions: {
    toggle: (channelId) => json('post', `/subscriptions/c/${channelId}`),
    subscribers: (channelId) => json('get', `/subscriptions/c/${channelId}`),
    channels: (userId) => json('get', `/subscriptions/u/${userId}`),
  },
  dashboard: {
    stats: () => json('get', '/dashboard/stats'),
    videos: (params) => json('get', '/dashboard/videos', undefined, params),
  },
};

function upload(url, field, file, fields = {}) {
  const form = new FormData();
  if (file) form.append(field, file);
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== '') form.append(key, value);
  });
  return request({ method: 'patch', url, data: form });
}

function uploadMany(url, data) {
  const form = new FormData();
  ['title', 'description'].forEach((key) => form.append(key, data[key] || ''));
  form.append('videoFile', data.videoFile);
  form.append('thumbnail', data.thumbnail);
  return request({ method: 'post', url, data: form });
}
