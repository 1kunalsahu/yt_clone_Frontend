# Backend API inventory

The frontend targets `VITE_API_URL`, which should be `http://localhost:8000/api/v1` for the current backend. Every route below is prefixed by that value. Except for healthcheck, registration, login, and refresh-token, routes require the backend's `verifyJWT` middleware. Authentication is cookie-based (`accessToken` and `refreshToken`, both `httpOnly`), and the middleware also accepts an Authorization bearer header.

The backend's normal response wrapper is `{ statusCode, data, message, success }`, but a few user and playlist handlers return raw objects/arrays. The API layer intentionally preserves these shapes and adapts them only at the page boundary.

| Method | URL | Auth | Request | Successful response | Main errors |
|---|---|---|---|---|---|
| GET | `/healthcheck` | No | None | `data: { status: "ok" }` | 500 |
| POST | `/users/register` | No | Multipart: `fullName`, `email`, `username`, `password`, required `avatar`, optional `coverImage` | `data: user` | 400 validation/upload, 409 duplicate |
| POST | `/users/login` | No | JSON: `email` or `username`, `password` | `data: { user, accessToken, refreshToken }`; sets cookies | 400, 403 |
| POST | `/users/logout` | Yes | None | `data: {}`; clears cookies | 401 |
| POST | `/users/refresh-token` | Refresh cookie or JSON `refreshToken` | None or `refreshToken` | Sets rotated cookies; backend data is a string | 401 |
| GET | `/users/currentUser` | Yes | None | Raw `{ user, message }` | 401 |
| POST | `/users/change/Password` | Yes | JSON: `oldPassword`, `newPassword`, `confirmPassword` | `data: "password changed"` | 400 |
| PATCH | `/users/change-avatar` | Yes | Multipart `avatar` | Raw `{ user, message }` | 403, 400 |
| PATCH | `/users/cover-Image` | Yes | Multipart `coverImage` | Raw `{ user, message }` | 403, 400 |
| GET | `/users/c/:username` | Yes | Path username | `data: channel profile` | 400, 404 |
| GET | `/users/history` | Yes | None | `data: video[]` | 401 |
| GET | `/videos` | Yes | Query: `page`, `limit` 1–100, `query`, `sortBy` (`createdAt`, `views`, `title`), `sortType`, optional `userId` | `data: { videos, page, limit, totalVideos, totalPages }` | 400 |
| POST | `/videos` | Yes | Multipart: `title`, `description`, `videoFile` video, `thumbnail` image | `data: video` | 400, 500 |
| GET | `/videos/:videoId` | Yes | Path ID; increments views | `data: video` | 400, 404 |
| PATCH | `/videos/:videoId` | Yes | Multipart optional `title`, `description`, `thumbnail` image | `data: video` | 400, 404 |
| DELETE | `/videos/:videoId` | Yes | Path ID | `data: deleted video` | 400, 404 |
| PATCH | `/videos/toggle/publish/:videoId` | Yes | Path ID | `data: updated video` | 400, 404 |
| GET | `/comments/:videoId` | Yes | Query `page`, `limit` | `data: { comments, page, limit, totalComments, totalPages }` | 400, 404 |
| POST | `/comments/:videoId` | Yes | JSON `content` | `data: comment` | 400, 404 |
| PATCH | `/comments/c/:commentId` | Yes/owner | JSON `content` | `data: comment` | 400, 404 |
| DELETE | `/comments/c/:commentId` | Yes/owner | Path ID | `data: deleted comment` | 400, 404 |
| POST | `/likes/toggle/v/:videoId` | Yes | Path ID | `data: { liked }` | 400, 404 |
| POST | `/likes/toggle/c/:commentId` | Yes | Path ID | `data: { liked }` | 400, 404 |
| POST | `/likes/toggle/t/:tweetId` | Yes | Path ID | `data: { liked }` | 400, 404 |
| GET | `/likes/videos` | Yes | Query `page`, `limit` | `data: { videos, page, limit, total, totalPages }` | 401 |
| POST | `/playlist` | Yes | JSON `name`, optional `description` | `data: "playlist added"` | 400 |
| GET | `/playlist/:playlistId` | Yes | Path ID | `data: playlist` with populated videos/owner | 400, 404 |
| PATCH | `/playlist/:playlistId` | Yes/owner | JSON `name` and/or `description` | `data: playlist` | 400, 404 |
| DELETE | `/playlist/:playlistId` | Yes/owner | Path ID | `data: deleted playlist` | 400, 404 |
| PATCH | `/playlist/add/:videoId/:playlistId` | Yes | Path IDs | `data: playlist` | 400 |
| PATCH | `/playlist/remove/:videoId/:playlistId` | Yes/owner | Path IDs | `data: playlist` | 400, 404 |
| GET | `/playlist/user/:userId` | Yes | Query `page`, `limit` | `data: playlist[]` (no total metadata) | 400 |
| POST | `/tweets` | Yes | JSON `content` | `data: tweet` | 400 |
| GET | `/tweets/user/:userId` | Yes | Path ID | `data: tweet[]` | 400, 404 |
| PATCH | `/tweets/:tweetId` | Yes/owner | JSON `content` | `data: tweet` | 400, 404 |
| DELETE | `/tweets/:tweetId` | Yes/owner | Path ID | `data: deleted tweet` | 400, 404 |
| POST | `/subscriptions/c/:channelId` | Yes | Path ID | `data: { subscribed }` | 400, 404 |
| GET | `/subscriptions/c/:channelId` | Yes | Path ID | `data: subscription[]` | 400, 404 |
| GET | `/subscriptions/u/:subscriberId` | Yes | Path ID | `data: subscription[]` | 400, 404 |
| GET | `/dashboard/stats` | Yes | None | `data: { totalVideos, totalViews, totalSubscribers, totalLikes }` | 401 |
| GET | `/dashboard/videos` | Yes | Query `page`, `limit` 1–100 | `data: { videos, page, limit, totalVideos, totalPages }` | 400, 401 |

## Identified backend ambiguities/blockers

1. The current backend `.env` uses `CORS_ORIGIN=*`, while `app.js` enables `credentials: true`. Credentialed browsers cannot use `*`; local development requires `CORS_ORIGIN=http://localhost:5173` (and production requires the exact deployed frontend origin). This frontend does not change backend behavior.
2. `refresh-token` returns an `ApiResponse` whose `data` is a string rather than an object. The frontend relies on the rotated cookies and then calls `currentUser`.
3. `currentUser`, avatar, and cover-image handlers return raw `{ user, message }` objects rather than `ApiResponse` objects. The API layer handles current-user normalization.
4. `getUserPlaylists` returns an array without total-count metadata, so the frontend cannot display reliable playlist pagination controls.
5. The backend login response includes access and refresh tokens in JSON even though it also sets `httpOnly` cookies. The frontend deliberately does not persist or expose those token values.
6. Watch history is read-only from the frontend. The inspected backend has no endpoint that explicitly appends a video to `watchHistory`; opening a video only increments its views.
