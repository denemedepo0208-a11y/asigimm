import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from '../config/supabase.js';
import { setupSocketHandlers } from './socketHandlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReelsTogether Server is running' });
});

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    version: '2.0.0',
    connections: io.engine.clientsCount
  });
});

// Setup Socket.io handlers
setupSocketHandlers(io);

// Initialize database
setupDatabase().then(() => {
  console.log('Database setup complete');
}).catch(err => {
  console.error('Database setup error:', err);
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   🎬 ReelsTogether Server v2.0       ║
  ║   Server running on port ${PORT}        ║
  ║   Socket.io ready for connections     ║
  ╚═══════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
