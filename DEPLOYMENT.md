# 🚀 AirTalk Deployment Guide

Complete guide for deploying AirTalk to production.

---

## 📋 Deployment Options

### Option 1: Render (Recommended - Free Tier)

#### Prerequisites
- GitHub account
- Render account (sign up at https://render.com)

#### Step 1: Deploy Backend

1. Go to https://dashboard.render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `airtalk-backend`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
   ```

6. Click **"Create Web Service"**
7. Copy the backend URL (e.g., `https://airtalk-backend.onrender.com`)

#### Step 2: Deploy Frontend

1. Click **"New +"** → **"Web Service"**
2. Select the same repository
3. Configure:
   - **Name**: `airtalk-frontend`
   - **Root Directory**: `.` (leave blank or use root)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   VITE_WS_SERVER_URL=wss://airtalk-backend.onrender.com
   ```

5. Click **"Create Web Service"**

#### Step 3: Update CORS

1. Go back to backend service settings
2. Update `ALLOWED_ORIGINS` with your frontend URL:
   ```
   ALLOWED_ORIGINS=https://airtalk-frontend.onrender.com
   ```

✅ **Done!** Your app is live!

---

### Option 2: Vercel (Frontend) + Render (Backend)

#### Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variable in Vercel dashboard:
```
VITE_WS_SERVER_URL=wss://your-backend.onrender.com
```

#### Deploy Backend to Render
Follow "Deploy Backend" steps from Option 1.

---

### Option 3: Railway (Full Stack)

1. Go to https://railway.app/
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect both services

Add environment variables:
- Frontend: `VITE_WS_SERVER_URL`
- Backend: `ALLOWED_ORIGINS`, `PORT`

---

### Option 4: Docker (Self-Hosted)

#### Frontend
```bash
# Build
docker build -t airtalk-frontend .

# Run
docker run -d -p 3000:3000 \
  -e VITE_WS_SERVER_URL=wss://your-backend.com \
  airtalk-frontend
```

#### Backend
```bash
cd server

# Build
docker build -t airtalk-backend .

# Run
docker run -d -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e ALLOWED_ORIGINS=https://your-frontend.com \
  airtalk-backend
```

#### Using Docker Compose
```bash
cd server
docker-compose up -d
```

---

## 🔧 Configuration

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WS_SERVER_URL` | Backend WebSocket URL | `wss://api.example.com` |
| `NODE_ENV` | Environment | `production` |

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` or `10000` (Render) |
| `NODE_ENV` | Environment | `production` |
| `ALLOWED_ORIGINS` | CORS origins | `https://example.com` |
| `REDIS_URL` | Redis connection (optional) | `redis://...` |
| `WS_HEARTBEAT_INTERVAL` | Ping interval (ms) | `25000` |

---

## 🌐 Custom Domain Setup

### For Render:

1. Go to your service settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `airtalk.com`)
4. Add CNAME record in your DNS:
   ```
   CNAME  @  your-app.onrender.com
   ```

### SSL Certificate
Render automatically provisions free SSL certificates via Let's Encrypt.

---

## 📊 Monitoring

### Render Dashboard
- View logs: Service → **Logs**
- Check metrics: Service → **Metrics**
- View events: Service → **Events**

### Health Checks
```bash
# Backend health
curl https://your-backend.onrender.com/health

# Backend stats
curl https://your-backend.onrender.com/stats
```

---

## ⚡ Performance Optimization

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

**Solutions:**
1. **Use a pinger service** (UptimeRobot, Pingdom)
2. **Upgrade to paid plan** ($7/month)
3. **Use Vercel for frontend** (always-on, free)

### Enable Keep-Alive
Add this to your backend `server.js`:
```javascript
// Keep the service alive
setInterval(async () => {
  try {
    const response = await fetch('https://your-backend.onrender.com/health');
    console.log('Keep-alive ping:', response.status);
  } catch (error) {
    console.error('Keep-alive error:', error);
  }
}, 840000); // Every 14 minutes
```

---

## 🔐 Security Checklist

- [ ] HTTPS/WSS enabled (automatic on Render)
- [ ] CORS properly configured
- [ ] Environment variables set
- [ ] No secrets in source code
- [ ] Rate limiting configured (optional)
- [ ] Error logging enabled

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Check:**
1. Backend is running: Visit `https://backend-url/health`
2. CORS configured: Check `ALLOWED_ORIGINS` includes frontend URL
3. WebSocket URL is correct: Should be `wss://` not `ws://`
4. Environment variable is set: `VITE_WS_SERVER_URL`

**Fix:**
```bash
# Redeploy with correct environment variables
vercel --prod
# or
# Update in Render dashboard → Environment → Redeploy
```

### Backend Service Spinning Down

**Solutions:**
1. Use UptimeRobot to ping every 5 minutes
2. Upgrade to paid Render plan
3. Switch backend to Railway (less spin-down)

### WebRTC Connection Fails

**Check:**
1. TURN server configured (for NAT traversal)
2. Firewall not blocking WebRTC
3. Browser permissions granted

---

## 💰 Cost Estimation

### Free Tier (Render + Vercel)
- **Frontend** (Vercel): FREE
- **Backend** (Render): FREE (with spin-down)
- **Total**: $0/month

### Recommended Production Setup
- **Frontend** (Vercel): FREE
- **Backend** (Render Starter): $7/month
- **Redis** (Render): $10/month (optional)
- **TURN Server** (Xirsys): FREE tier
- **Total**: $7-17/month

### High-Traffic Setup (1000+ concurrent users)
- **Frontend** (Vercel Pro): $20/month
- **Backend** (Render Standard): $25/month × 2 instances
- **Redis** (Render): $10/month
- **TURN Server** (Xirsys Business): $49/month
- **Total**: $129/month

---

## 📈 Scaling Guide

### 1-100 Users
- Single backend instance (Render Free)
- No Redis needed

### 100-1000 Users
- Render Starter plan
- Add Redis for session management
- Configure TURN server

### 1000+ Users
- Multiple backend instances
- Load balancer (NGINX)
- Redis cluster
- Dedicated TURN servers

---

## 🔄 CI/CD

### Auto-Deploy on Push

Render automatically deploys on:
- Push to `main` branch
- Pull request merge

### Manual Deploy
```bash
# Trigger manual deploy via Render dashboard
# or use Render API
curl -X POST https://api.render.com/deploy/srv-xxx
```

---

## 📞 Support

**Issues?**
- Check deployment logs
- Review environment variables
- Test health endpoints
- Check CORS configuration

**Need Help?**
- Open an issue on GitHub
- Check Render status: https://status.render.com/
- Review documentation: https://render.com/docs

---

**Your AirTalk app is now ready for the world! 🌍**
