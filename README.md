# ChaiTube frontend

Production-oriented React + Vite frontend for the existing ChaiTube backend.

## Local development

1. Start MongoDB/Cloudinary-backed backend first:

   ```powershell
   cd "..\chai aur code backend"
   npm install
   npm run dev
   ```

2. In the backend `.env`, set the exact frontend origin. The existing `CORS_ORIGIN=*` is incompatible with credentialed cookies:

   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

3. Start the frontend:

   ```powershell
   cd ..\frontend
   npm install
   npm run dev
   ```

The frontend uses one public environment variable:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Copy `.env.example` to `.env` if needed. Vite environment changes require restarting the dev server. Production changes require rebuilding and redeploying the frontend. Never put JWT secrets, database credentials, or Cloudinary secrets in `VITE_` variables.

## Authentication and cookies

The backend sets `httpOnly` `accessToken` and `refreshToken` cookies. Axios is centralized in `src/api/http.js` and uses `withCredentials: true`; the frontend does not store token strings in localStorage. On startup it calls `currentUser`, then attempts `refresh-token` if the access cookie has expired.

For production, configure the backend CORS origin to the exact deployed frontend origin, keep credentials enabled, and use HTTPS. Cross-site deployments may additionally require backend cookie `SameSite=None; Secure` settings; those are backend deployment settings and are not changed here.

## Commands

```powershell
npm run dev       # local Vite development server
npm run build     # production build
npm run preview   # preview production build
npm run test      # frontend unit tests
npm run lint      # ESLint
```

## Implemented flows

Registration with avatar/cover uploads, login by email or username, cookie session restoration and refresh, logout, protected routes, video search/sort/pagination, video upload/update/delete/publish toggling, video playback, comments, likes, playlists, tweets, channel profiles, subscriptions, dashboard statistics, profile-image updates, password changes, watch history, and liked videos.

See [API_INVENTORY.md](./API_INVENTORY.md) for the complete endpoint contract and backend inconsistencies discovered during inspection.

## Deployment

Set `VITE_API_URL` to the deployed backend API prefix, restart/rebuild the frontend, and configure the backend's `CORS_ORIGIN` to the exact deployed frontend origin. The backend must also have its own MongoDB, JWT, and Cloudinary environment variables configured by the hosting platform.
