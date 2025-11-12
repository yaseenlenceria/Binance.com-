import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const HEARTBEAT_INTERVAL = parseInt(process.env.WS_HEARTBEAT_INTERVAL) || 25000;
const HEARTBEAT_TIMEOUT = parseInt(process.env.WS_HEARTBEAT_TIMEOUT) || 30000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeConnections: wss.clients.size,
    waitingUsers: waitingUsers.length
  });
});

// Stats endpoint
app.get('/stats', (req, res) => {
  res.json({
    totalConnections: wss.clients.size,
    waitingUsers: waitingUsers.length,
    activeMatches: activeMatches.size,
    uptime: process.uptime()
  });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

// In-memory storage (Redis can be added for scaling)
let waitingUsers = [];
const activeMatches = new Map(); // userId -> { partner, ws }
const userSessions = new Map(); // ws -> userData

// Optional Redis client for distributed systems
let redisClient = null;
const useRedis = !!process.env.REDIS_URL;

if (useRedis) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.on('connect', () => console.log('✅ Connected to Redis'));
  await redisClient.connect().catch(err => {
    console.warn('⚠️  Redis connection failed, falling back to in-memory storage');
    redisClient = null;
  });
}

// Utility: Generate unique connection ID
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Utility: Send JSON message safely
function sendMessage(ws, message) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Heartbeat mechanism to detect dead connections
function setupHeartbeat(ws) {
  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'ping') {
        sendMessage(ws, { type: 'pong', timestamp: Date.now() });
        ws.isAlive = true;
      }
    } catch (e) {
      // Not a ping message, ignore
    }
  });
}

// Heartbeat interval
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log(`⚠️  Terminating dead connection: ${ws.userId}`);
      return handleDisconnect(ws);
    }

    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

// Random matching algorithm
function findMatch(currentUser) {
  if (waitingUsers.length === 0) {
    return null;
  }

  // Random selection from waiting pool
  const randomIndex = Math.floor(Math.random() * waitingUsers.length);
  const partner = waitingUsers.splice(randomIndex, 1)[0];

  // Ensure we don't match a user with themselves
  if (partner.userId === currentUser.userId) {
    waitingUsers.push(partner);
    return null;
  }

  return partner;
}

// Handle user joining the waiting pool
function handleJoin(ws, data) {
  const userId = data.id || generateId();
  const country = data.country || '🏳️';

  ws.userId = userId;
  ws.country = country;

  console.log(`👤 User ${userId} joined from ${country}`);

  // Store user session
  userSessions.set(ws, { userId, country, joinedAt: Date.now() });

  // Try to find a match immediately
  const partner = findMatch({ userId, country, ws });

  if (partner) {
    // Match found!
    console.log(`✅ Match found: ${userId} (${country}) <-> ${partner.userId} (${partner.country})`);

    // Establish partnership
    ws.partner = partner.ws;
    partner.ws.partner = ws;

    // Store active match
    activeMatches.set(userId, { partner: partner.userId, ws });
    activeMatches.set(partner.userId, { partner: userId, ws: partner.ws });

    // Notify both users
    sendMessage(ws, {
      type: 'match',
      country: partner.country,
      partnerId: partner.userId
    });

    sendMessage(partner.ws, {
      type: 'match',
      country: country,
      partnerId: userId
    });
  } else {
    // No match found, add to waiting pool
    waitingUsers.push({ userId, country, ws, joinedAt: Date.now() });
    console.log(`⏳ User ${userId} added to waiting pool (${waitingUsers.length} waiting)`);

    sendMessage(ws, { type: 'searching' });
  }
}

// Handle WebRTC signaling
function handleSignal(ws, data) {
  if (ws.partner && ws.partner.readyState === ws.partner.OPEN) {
    sendMessage(ws.partner, { type: 'signal', data: data.data });
  } else {
    console.warn(`⚠️  Cannot relay signal: partner not available for ${ws.userId}`);
  }
}

// Handle reconnection requests
function handleReconnect(ws) {
  console.log(`🔄 Reconnection request from ${ws.userId}`);

  // Clean up old connection state
  if (ws.partner) {
    sendMessage(ws.partner, { type: 'partnerDisconnected' });
    ws.partner.partner = null;

    // Re-add partner to waiting pool
    const partnerData = userSessions.get(ws.partner);
    if (partnerData) {
      waitingUsers.push({
        userId: ws.partner.userId,
        country: ws.partner.country,
        ws: ws.partner,
        joinedAt: Date.now()
      });
    }
  }

  // Re-add current user to waiting pool
  const userData = userSessions.get(ws);
  if (userData) {
    handleJoin(ws, { id: ws.userId, country: ws.country });
  }
}

// Handle disconnection
function handleDisconnect(ws) {
  const userData = userSessions.get(ws);

  if (!userData) {
    ws.terminate();
    return;
  }

  console.log(`👋 User ${userData.userId} disconnected`);

  // Remove from waiting pool
  waitingUsers = waitingUsers.filter(u => u.ws !== ws);

  // Notify partner if exists
  if (ws.partner) {
    sendMessage(ws.partner, { type: 'partnerDisconnected' });
    ws.partner.partner = null;

    // Re-add partner to waiting pool if they're still connected
    if (ws.partner.readyState === ws.partner.OPEN) {
      const partnerData = userSessions.get(ws.partner);
      if (partnerData) {
        waitingUsers.push({
          userId: ws.partner.userId,
          country: ws.partner.country,
          ws: ws.partner,
          joinedAt: Date.now()
        });
        sendMessage(ws.partner, { type: 'searching' });
      }
    }
  }

  // Clean up active match
  if (userData.userId) {
    activeMatches.delete(userData.userId);
  }

  // Clean up session
  userSessions.delete(ws);

  ws.terminate();
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  console.log(`🔌 New connection from ${req.socket.remoteAddress}`);

  setupHeartbeat(ws);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'find':
          handleJoin(ws, message);
          break;
        case 'signal':
          handleSignal(ws, message);
          break;
        case 'reconnect':
          handleReconnect(ws);
          break;
        case 'ping':
          sendMessage(ws, { type: 'pong', timestamp: Date.now() });
          break;
        default:
          console.warn(`⚠️  Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${ws.userId}:`, error);
    handleDisconnect(ws);
  });
});

// Cleanup stale waiting users (optional)
setInterval(() => {
  const now = Date.now();
  const maxWaitTime = parseInt(process.env.MAX_WAITING_TIME) || 60000;

  waitingUsers = waitingUsers.filter(user => {
    if (now - user.joinedAt > maxWaitTime) {
      console.log(`⏰ Removing stale user ${user.userId} from waiting pool`);
      sendMessage(user.ws, { type: 'timeout' });
      return false;
    }
    return true;
  });
}, 30000);

// Start server
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  🎙️  AirTalk Signaling Server               ║
║  ✅ Server running on port ${PORT}            ║
║  📡 WebSocket: ws://localhost:${PORT}        ║
║  🏥 Health check: http://localhost:${PORT}/health ║
║  ${useRedis && redisClient ? '💾 Redis: Connected' : '💾 Redis: In-Memory Mode'}                   ║
╚══════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');

  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  wss.clients.forEach((ws) => {
    sendMessage(ws, { type: 'serverShutdown' });
    ws.close();
  });

  if (redisClient) {
    await redisClient.quit();
  }

  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('⚠️  SIGINT received, shutting down gracefully...');

  server.close(() => {
    console.log('✅ HTTP server closed');
  });

  if (redisClient) {
    await redisClient.quit();
  }

  process.exit(0);
});
