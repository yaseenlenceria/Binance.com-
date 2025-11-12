# 🚀 Render Deployment Guide - Fix Random Matching

Your frontend is deployed but **can't connect to random users** because the backend signaling server isn't deployed yet. Follow these steps:

## Problem
- Frontend URL: `https://binance-com-9war.onrender.com`
- Frontend trying to connect to: `ws://localhost:8080` ❌
- **Backend server NOT deployed yet** ❌

## Solution: Deploy Backend + Configure Frontend

### Step 1: Deploy Backend Signaling Server

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect to your GitHub repository
   - Select your repo: `Binance.com-`

3. **Configure Backend Service**:
   ```
   Name: airtalk-backend-[YOUR-NAME]
   Runtime: Node
   Region: Oregon (or same as frontend)
   Branch: claude/global-random-voice-chat-011CV4CPedFrENNPrqczHywT
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables**:
   ```
   NODE_ENV = production
   PORT = 10000
   ALLOWED_ORIGINS = https://binance-com-9war.onrender.com
   WS_HEARTBEAT_INTERVAL = 25000
   WS_HEARTBEAT_TIMEOUT = 30000
   MAX_WAITING_TIME = 60000
   ```

5. **Click "Create Web Service"** and wait for deployment

6. **Copy the Backend URL**: After deployment, you'll get a URL like:
   ```
   https://airtalk-backend-yourname.onrender.com
   ```

### Step 2: Update Frontend Configuration

1. **Go to your Frontend Service** on Render Dashboard
2. **Navigate to**: Environment tab
3. **Add/Update Environment Variable**:
   ```
   Key: VITE_WS_SERVER_URL
   Value: wss://airtalk-backend-yourname.onrender.com
   ```
   ⚠️ **Important**: Use `wss://` (secure WebSocket) NOT `ws://`!

4. **Save Changes** → This will trigger automatic redeployment

### Step 3: Update Backend CORS

1. **Go back to Backend Service** on Render Dashboard
2. **Update Environment Variable**:
   ```
   Key: ALLOWED_ORIGINS
   Value: https://binance-com-9war.onrender.com
   ```

3. **Save Changes** → Backend will redeploy

### Step 4: Test the Connection

1. **Open your frontend**: https://binance-com-9war.onrender.com
2. **Open Browser Console** (F12)
3. **Click "Start Call"**
4. **Check console for WebSocket connection**:
   ```
   ✅ WebSocket connected to wss://airtalk-backend-yourname.onrender.com
   🔍 Searching for random partner...
   ```

5. **Open in TWO different browsers/devices** to test random matching!

## Quick Checklist

- [ ] Backend server deployed on Render
- [ ] Backend URL copied (e.g., `https://airtalk-backend-yourname.onrender.com`)
- [ ] Frontend env var `VITE_WS_SERVER_URL` = `wss://your-backend-url.onrender.com`
- [ ] Backend env var `ALLOWED_ORIGINS` = `https://binance-com-9war.onrender.com`
- [ ] Both services redeployed
- [ ] Tested with 2+ browsers/devices

## Troubleshooting

### "WebSocket connection failed"
- Check that `VITE_WS_SERVER_URL` uses `wss://` (not `ws://`)
- Verify backend URL is correct and server is running
- Check browser console for exact error message

### "CORS error"
- Update backend `ALLOWED_ORIGINS` to include your frontend URL
- Make sure there are no trailing slashes in URLs

### "Still searching forever"
- Open the app in **two different browsers** (or two devices)
- Check backend logs on Render for matching activity
- Verify WebSocket is connected in both browsers

### Backend service keeps spinning down (Free Plan)
- Render's free tier spins down after 15 minutes of inactivity
- First connection after spin-down takes ~30 seconds
- Consider upgrading to a paid plan for always-on service

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  User 1 Browser                                     │
│  https://binance-com-9war.onrender.com             │
│  ↓ WebSocket: wss://backend.onrender.com           │
└─────────────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Backend Signaling Server                           │
│  https://airtalk-backend-yourname.onrender.com     │
│  • Manages waiting pool                             │
│  • Random matching algorithm                        │
│  • Relays WebRTC signals (SDP/ICE)                 │
└─────────────────────────────────────────────────────┘
                     ↑
┌─────────────────────────────────────────────────────┐
│  User 2 Browser                                     │
│  https://binance-com-9war.onrender.com             │
│  ↑ WebSocket: wss://backend.onrender.com           │
└─────────────────────────────────────────────────────┘

         After matching: Direct P2P WebRTC Audio →
```

## Cost

- **Free Tier**: Both services on free plan = $0/month
  - 750 hours/month per service
  - Spins down after 15 min inactivity
  - Suitable for testing

- **Paid Tier**: $7/month per service = $14/month
  - Always-on (no spin down)
  - Better for production use

## Need Help?

Check the backend server logs:
1. Go to Render Dashboard
2. Click on "airtalk-backend-[yourname]"
3. Go to "Logs" tab
4. Look for connection/matching activity

Check the frontend in browser:
1. Open F12 Developer Tools
2. Go to "Console" tab
3. Look for WebSocket connection messages
4. Check "Network" tab → "WS" filter for WebSocket traffic
