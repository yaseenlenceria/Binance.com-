# AirTalk Signaling Server

WebSocket signaling server for the AirTalk global random voice chat system.

## Features

- Random user matching algorithm
- WebRTC signaling (SDP/ICE exchange)
- Heartbeat monitoring (ping/pong)
- Reconnection handling
- Optional Redis integration for scaling
- Health check endpoints
- Graceful shutdown

## Quick Start

### Local Development

```bash
npm install
npm start
```

Server will start on `http://localhost:8080`

### Using Docker

```bash
docker build -t airtalk-server .
docker run -d -p 8080:8080 airtalk-server
```

### Using Docker Compose (with Redis)

```bash
docker-compose up -d
```

## Configuration

Create a `.env` file:

```env
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
REDIS_URL=redis://localhost:6379
WS_HEARTBEAT_INTERVAL=25000
WS_HEARTBEAT_TIMEOUT=30000
MAX_WAITING_TIME=60000
```

## API Endpoints

### Health Check
```
GET /health
```

Returns server status and connection statistics.

### Stats
```
GET /stats
```

Returns detailed server statistics.

## WebSocket Protocol

### Client Messages

**Find Match**
```json
{
  "type": "find",
  "id": "user-uuid",
  "country": "🇺🇸"
}
```

**WebRTC Signal**
```json
{
  "type": "signal",
  "data": { "sdp": {...}, "candidate": {...} }
}
```

**Reconnect**
```json
{
  "type": "reconnect"
}
```

**Ping**
```json
{
  "type": "ping"
}
```

### Server Messages

**Match Found**
```json
{
  "type": "match",
  "country": "🇯🇵",
  "partnerId": "partner-uuid"
}
```

**Signal Relay**
```json
{
  "type": "signal",
  "data": { "sdp": {...}, "candidate": {...} }
}
```

**Partner Disconnected**
```json
{
  "type": "partnerDisconnected"
}
```

**Pong**
```json
{
  "type": "pong",
  "timestamp": 1234567890
}
```

## Scaling

### Horizontal Scaling with Redis

1. Set `REDIS_URL` in `.env`
2. Deploy multiple instances behind a load balancer
3. Use sticky sessions or Redis pub/sub

### Using PM2

```bash
npm install -g pm2
pm2 start server.js -i max --name airtalk-server
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use HTTPS/WSS with SSL certificates
3. Configure CORS properly
4. Set up monitoring (PM2, DataDog, etc.)
5. Enable Redis for distributed matching
6. Use a reverse proxy (NGINX/HAProxy)

## Monitoring

```bash
# Check health
curl http://localhost:8080/health

# View stats
curl http://localhost:8080/stats

# PM2 monitoring
pm2 monit
pm2 logs
```

## License

MIT
