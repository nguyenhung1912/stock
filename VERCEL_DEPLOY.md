# Vercel Deploy Checklist

This repo should be deployed as two Vercel projects.

## 1. Backend project

- Root Directory: `backend`
- Runtime: Node.js
- Node version: `22.x` is the safest choice for this repo
- Required environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `JWT_EXPIRES_IN`
  - `JWT_REFRESH_EXPIRES_IN`

Quick checks:

- Open `https://<your-backend>.vercel.app/health`
- Expected response: JSON with `{ "status": "ok" }`

If login still returns `Cannot login`, open the backend Function Logs and look for one of these:

- `MONGODB_URI is missing for this deployment.`
- `JWT_SECRET is missing for this deployment.`
- `JWT_REFRESH_SECRET is missing for this deployment.`
- MongoDB connection errors such as timeout, auth failure, or network access denied

MongoDB Atlas note:

- If Atlas only allows your local IP, Vercel will fail to connect.
- Add Vercel access in Atlas network settings, or temporarily allow `0.0.0.0/0` for testing.

## 2. Frontend project

- Root Directory: `frontend`
- Framework Preset: Vite
- Node version: `22.x`
- Required environment variables:
  - `VITE_API_BASE_URL=https://<your-backend>.vercel.app`

Quick checks:

- Open the deployed frontend
- Submit login and inspect the browser Network tab
- The login request should go to `https://<your-backend>.vercel.app/login`

If the frontend shows an API base URL error:

- Confirm `VITE_API_BASE_URL` is set on the frontend project
- Redeploy the frontend after saving the env var

## 3. Common mistake

Do not deploy the repo root as one Vercel project unless you also redesign the routing/build setup.

For the current codebase, the safe setup is:

- one Vercel project for `backend`
- one Vercel project for `frontend`
