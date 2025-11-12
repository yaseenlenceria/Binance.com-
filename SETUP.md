# 🎙️ AirTalk - Global Random Voice Chat Setup Guide

Complete setup guide for the AirTalk global random voice chat system.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Production Deployment](#production-deployment)
6. [TURN Server Setup](#turn-server-setup)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 System Requirements

### Minimum Requirements
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Latest version
- **Redis** (optional): For scaling across multiple servers

### Recommended for Production
- **Operating System**: Linux (Ubuntu 20.04+)
- **Memory**: 2GB RAM minimum, 4GB+ recommended
- **CPU**: 2+ cores
- **Network**: Stable internet with low latency
- **SSL Certificate**: For HTTPS/WSS (Let's Encrypt recommended)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd airtalk-voice-chat
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 3. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

**Frontend** (`.env.local`):
```env
VITE_WS_SERVER_URL=ws://localhost:8080
```

### 4. Start the Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Open Your Browser

Navigate to: `http://localhost:5173`

---

## 🖥️ Backend Setup

### Directory Structure

```
server/
├── server.js          # Main signaling server
├── package.json       # Dependencies
├── .env              # Environment config
└── .env.example      # Example config
```

### Configuration Options

Edit `server/.env`:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Redis (Optional - for multi-server scaling)
REDIS_URL=redis://localhost:6379

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com

# WebSocket Heartbeat
WS_HEARTBEAT_INTERVAL=25000
WS_HEARTBEAT_TIMEOUT=30000

# Matching
MAX_WAITING_TIME=60000
```

### Running with Redis

1. **Install Redis:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server

   # macOS
   brew install redis
   ```

2. **Start Redis:**
   ```bash
   redis-server
   ```

3. **Enable in .env:**
   ```env
   REDIS_URL=redis://localhost:6379
   ```

### API Endpoints

- **Health Check**: `GET http://localhost:8080/health`
- **Stats**: `GET http://localhost:8080/stats`
- **WebSocket**: `ws://localhost:8080`

---

## 🎨 Frontend Setup

### Directory Structure

```
/
├── App.tsx                    # Main app component
├── components/
│   ├── Header.tsx
│   ├── CallInterface.tsx
│   ├── ChatWindow.tsx
│   ├── CountrySelector.tsx    # NEW: Country picker
│   └── Footer.tsx
├── hooks/
│   └── useWebRTC.ts          # WebRTC logic
├── types.ts
└── .env.local                # Environment config
```

### Environment Variables

Create `.env.local`:

```env
# WebSocket Server URL
VITE_WS_SERVER_URL=ws://localhost:8080

# For production with SSL
# VITE_WS_SERVER_URL=wss://your-domain.com
```

### Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

---

## 🌐 Production Deployment

### Backend Deployment

#### Option 1: Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start server
cd server
pm2 start server.js --name airtalk-server

# Enable startup on boot
pm2 startup
pm2 save
```

#### Option 2: Docker

Create `server/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t airtalk-server ./server
docker run -d -p 8080:8080 --name airtalk airtalk-server
```

### Frontend Deployment

#### Option 1: Vercel (Easiest)

```bash
npm install -g vercel
vercel --prod
```

#### Option 2: Netlify

```bash
npm run build
# Drag dist/ folder to netlify.com
```

#### Option 3: Static Hosting

```bash
npm run build
# Upload dist/ to your web server
```

### NGINX Reverse Proxy

Create `/etc/nginx/sites-available/airtalk`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        root /var/www/airtalk/dist;
        try_files $uri $uri/ /index.html;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/airtalk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 TURN Server Setup

For reliable connections behind NAT/firewalls, you need a TURN server.

### Option 1: Use Existing Service

**Xirsys (Easiest):**
1. Sign up at https://xirsys.com
2. Get credentials
3. Update `hooks/useWebRTC.ts`:

```typescript
const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: ['turn:turn.xirsys.com:80?transport=udp', 'turn:turn.xirsys.com:3478?transport=tcp'],
      username: 'your-xirsys-username',
      credential: 'your-xirsys-credential'
    }
  ]
};
```

### Option 2: Self-Host with Coturn

**Install Coturn:**

```bash
# Ubuntu/Debian
sudo apt-get install coturn
```

**Configure** `/etc/turnserver.conf`:

```conf
listening-port=3478
fingerprint
lt-cred-mech
use-auth-secret
static-auth-secret=your-secret-key
realm=yourdomain.com
total-quota=100
stale-nonce=600
cert=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
pkey=/etc/letsencrypt/live/yourdomain.com/privkey.pem
no-tlsv1
no-tlsv1_1
```

**Start Coturn:**

```bash
sudo systemctl enable coturn
sudo systemctl start coturn
```

**Update Frontend:**

```typescript
{
  urls: 'turn:yourdomain.com:3478',
  username: 'username',
  credential: 'your-secret-key'
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. WebSocket Connection Fails

**Problem**: Frontend can't connect to backend

**Solutions**:
- Check server is running: `curl http://localhost:8080/health`
- Verify CORS settings in `server/.env`
- Check firewall rules
- Ensure WebSocket URL matches in `.env.local`

#### 2. No Audio Heard

**Problem**: Connected but can't hear partner

**Solutions**:
- Check browser microphone permissions
- Verify TURN server configuration
- Open browser console for WebRTC errors
- Test on different network (corporate firewalls may block)

#### 3. Calls Drop Frequently

**Problem**: Connections unstable

**Solutions**:
- Add TURN server (not just STUN)
- Increase WebSocket heartbeat: `WS_HEARTBEAT_INTERVAL=15000`
- Check network stability
- Use multiple STUN servers

#### 4. High Memory Usage

**Problem**: Server using too much RAM

**Solutions**:
- Enable Redis for distributed matching
- Limit max connections with load balancer
- Reduce `MAX_WAITING_TIME`
- Use PM2 cluster mode

### Debug Mode

Enable verbose logging:

**Backend:**
```javascript
// In server.js
const DEBUG = true;
```

**Frontend:**
Open browser console (F12) to see WebRTC logs

### Testing Connection

```bash
# Test WebSocket
wscat -c ws://localhost:8080

# Test TURN server
npm install -g turn-tester
turn-tester turn:yourdomain.com:3478 username password
```

---

## 📊 Monitoring & Analytics

### Server Stats

Access real-time stats:
```bash
curl http://localhost:8080/stats
```

Response:
```json
{
  "totalConnections": 142,
  "waitingUsers": 3,
  "activeMatches": 69,
  "uptime": 86400
}
```

### PM2 Monitoring

```bash
pm2 monit          # Real-time dashboard
pm2 logs           # View logs
pm2 status         # Server status
```

---

## 🚀 Scaling to 1000+ Users

### Horizontal Scaling

1. **Enable Redis** in `server/.env`
2. **Deploy Multiple Instances** behind load balancer
3. **Use PM2 Cluster Mode**:
   ```bash
   pm2 start server.js -i max
   ```

### Load Balancer Setup

Use NGINX or HAProxy to distribute connections:

```nginx
upstream airtalk_backend {
    ip_hash;  # Sticky sessions
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}
```

---

## 📝 Environment Summary

### Development
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- WebSocket: `ws://localhost:8080`

### Production
- Backend: `https://api.yourdomain.com`
- Frontend: `https://yourdomain.com`
- WebSocket: `wss://api.yourdomain.com`

---

## ✅ Checklist Before Going Live

- [ ] SSL certificates installed
- [ ] TURN server configured
- [ ] Redis enabled for scaling
- [ ] CORS properly configured
- [ ] PM2 or Docker deployment
- [ ] NGINX reverse proxy setup
- [ ] Monitoring enabled
- [ ] Firewall rules configured
- [ ] Backup strategy in place
- [ ] Domain DNS configured

---

## 🆘 Support

For issues, check:
1. Server logs: `pm2 logs airtalk-server`
2. Browser console (F12)
3. Network tab for WebSocket errors
4. `/health` endpoint status

---

**Built with WebRTC, Node.js, and React** 🎙️
