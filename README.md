
# 🚀 FDAnalytics Deployment Guide

This guide explains how to deploy the full-stack application (React + Python Flask + PostgreSQL) to **Render.com** and how to securely manage your API keys.

---

## 🔒 Security First: Managing Keys
Your application uses sensitive keys (`GEMINI_API_KEY`, `DATABASE_URL`, `GOOGLE_CLIENT_ID`).

**NEVER** commit these keys directly to GitHub.
1.  **Locally**: We use a `.env` file (which is ignored by Git).
2.  **Production**: We use Render's **Environment Variables** dashboard.

---

## 🛠️ Step 1: Push to GitHub
1.  Make sure your `.gitignore` file (included in this project) is present.
2.  Commit and push your code to a public or private GitHub repository.

---

## 🗄️ Step 2: Create the Database (PostgreSQL)
1.  Log in to [Render.com](https://render.com).
2.  Click **New +** -> **PostgreSQL**.
3.  **Name**: `fdanalytics-db`.
4.  **Plan**: Select **Free** (data expires after 90 days) or **Starter** (persistent).
5.  Click **Create Database**.
6.  **Copy the "Internal Database URL"**. It looks like: `postgres://fdanalytics_user:password@dpg-cn.../fdanalytics`

---

## 🐍 Step 3: Deploy the Backend (Python)
1.  On Render, click **New +** -> **Web Service**.
2.  Connect your GitHub repository.
3.  **Name**: `fdanalytics-api`
4.  **Root Directory**: `backend` (⚠️ Important: Do not leave this empty).
5.  **Runtime**: Python 3
6.  **Build Command**: `pip install -r requirements.txt`
7.  **Start Command**: `gunicorn app:app`
8.  **Environment Variables** (Click "Add Environment Variable"):
    *   `DATABASE_URL`: Paste the Internal Database URL from Step 2.
    *   `GEMINI_API_KEY`: Paste your key from [Google AI Studio](https://aistudio.google.com/).
    *   `JWT_SECRET`: Enter a random long string (e.g., `super_secret_key_99`).
    *   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
    *   `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.
    *   `FRONTEND_URL`: *Leave this blank for now, we will add it in Step 5.*
9.  Click **Create Web Service**.
10. **Copy your Backend URL** (e.g., `https://fdanalytics-api.onrender.com`).

---

## ⚛️ Step 4: Deploy the Frontend (React)
1.  On Render, click **New +** -> **Static Site**.
2.  Connect your GitHub repository.
3.  **Name**: `fdanalytics-web`
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `dist`
6.  **Environment Variables**:
    *   `VITE_API_URL`: Paste your Backend URL from Step 3 (e.g., `https://fdanalytics-api.onrender.com`).
        *   *Note: Do not add `/api` at the end here if your code appends it manually, but based on `api.ts`, just the base URL is usually safer, or `.../api` if `api.ts` expects the full prefix. Check `services/api.ts`.* 
        *   *Correction*: In `services/api.ts`, we use `VITE_API_URL` directly. So set this to `https://fdanalytics-api.onrender.com/api` (including `/api`).
7.  Click **Create Static Site**.
8.  **Copy your Frontend URL** (e.g., `https://fdanalytics-web.onrender.com`).

---

## 🔗 Step 5: Final Connections
Now that both sides are live, link them together.

1.  **Update Backend Config**:
    *   Go to your **Backend (Web Service)** dashboard on Render.
    *   Go to **Environment Variables**.
    *   Add/Update `FRONTEND_URL` with your **Frontend URL** (e.g., `https://fdanalytics-web.onrender.com`).
    *   Save Changes. Render will redeploy the backend.

2.  **Update Google OAuth**:
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Select your project -> APIs & Services -> Credentials.
    *   Edit your OAuth 2.0 Client ID.
    *   **Authorized JavaScript origins**: Add your **Frontend URL**.
    *   **Authorized redirect URIs**: Add your **Backend URL** + `/api/auth/google/callback`.
        *   Example: `https://fdanalytics-api.onrender.com/api/auth/google/callback`
    *   Save.

---

## ✅ Deployment Checklist
- [ ] Database created.
- [ ] Backend deployed with `DATABASE_URL` and `GEMINI_API_KEY` set.
- [ ] Frontend deployed with `VITE_API_URL` set.
- [ ] Backend `FRONTEND_URL` variable updated.
- [ ] Google Cloud Console Redirect URIs updated.

Your app is now live! 🚀
