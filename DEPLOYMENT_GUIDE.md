# Deployment Guide - Cosplay Store

## Backend Deployment (Railway)

### Step 1: Prepare Your Repository checked 
1. Make sure all changes are committed to git:
```bash
cd back-end
git add .
git commit -m "Configure for Railway deployment"
```

### Step 2: Deploy to Railway

#### Option A: Using Railway CLI
1. Install Railway CLI from https://docs.railway.app/cli/install
2. Login to your Railway account:
```bash
railway login
```

3. Initialize a new Railway project:
```bash
railway init
# Select your project
# Choose to link to existing project or create new
```

4. Deploy:
```bash
railway up
```

#### Option B: Using Railway Dashboard (Recommended) checked 
1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub"
3. Select your GitHub repository (or use "Deploy from repo" for a zip file)
4. Select the `back-end` directory as the root directory
5. Railway will auto-detect it's a Spring Boot project

### Step 3: Configure Environment Variables on Railway Dashboard checked 

Once deployed, go to your project settings and add these variables:

```
DB_HOST=switchback.proxy.rlwy.net
DB_PORT=33728
DB_NAME=cosplay_store
DB_USER=root
DB_PASSWORD=pNYIUgPlricDOtjTKolijnHWCoKssmSO
JWT_SECRET=3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b
FRONTEND_URL=https://your-cosplay-store.vercel.app
PORT=8080
```

⚠️ **Important:** Generate a new JWT_SECRET for production:
```bash
# Linux/Mac:
openssl rand -hex 32

# Windows PowerShell:
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### Step 4: Get Your Backend URL
After deployment, Railway will provide you with a URL like:
```
https://your-app-name.railway.app
```

Keep this URL - you'll need it for the frontend!

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

1. Update the `.env.production` file with your Railway backend URL:
```
VITE_API_BASE_URL=https://your-app-name.railway.app/api
```

2. Commit changes:
```bash
cd front-end
git add .
git commit -m "Configure for Vercel deployment"
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login and deploy from the `front-end` directory:
```bash
cd front-end
vercel
```

3. Follow the prompts and set `dist` as the output directory (Vite default)

#### Option B: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. In "Root Directory", select `front-end`
5. Add Environment Variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-app-name.railway.app/api`
6. Click Deploy!

### Step 3: Update CORS on Railway Backend checked

Once you have your Vercel URL (e.g., `https://cosplay-store.vercel.app`), update the Railway environment variable:

```
FRONTEND_URL=https://cosplay-store.vercel.app
```

Redeploy the backend for changes to take effect.

---

## Environment Variables Summary

### Backend (.env and Railway)
- `DB_HOST`: Database host from Railway MySQL
- `DB_PORT`: Database port (33728)
- `DB_NAME`: Database name (cosplay_store)
- `DB_USER`: Database user (root)
- `DB_PASSWORD`: Your database password
- `JWT_SECRET`: Secure random string (generate new for production)
- `FRONTEND_URL`: Your Vercel frontend URL
- `PORT`: 8080 (Railway will override with their port)

### Frontend (.env.production)
- `VITE_API_BASE_URL`: Your Railway backend URL + /api

---

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check that `FRONTEND_URL` in Railway matches your exact Vercel URL
2. Make sure it includes the protocol (https://)
3. Redeploy the backend after updating

### API Connection Issues
1. Verify `VITE_API_BASE_URL` is correct in Vercel
2. Check Railway logs for database connection errors
3. Ensure JWT_SECRET is set and consistent

### Database Connection Issues on Railway
1. Verify DB credentials are correct
2. Check Railway MySQL add-on is connected
3. Ensure ddl-auto=update is allowing schema creation

---

## Testing the Deployment

1. Open your Vercel frontend URL
2. Try registering a new account
3. Try logging in
4. Test product browsing
5. Try adding items to cart
6. Check the browser console (F12) for any errors

Good luck! 🚀
