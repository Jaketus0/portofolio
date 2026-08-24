import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import morgan from 'morgan';
import next from 'next';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import { errorMiddleware } from './server/middlewares/error.middleware';
import { apiRouter } from './server/routes';
import { setupVisitorSocket } from './server/socket/visitor.socket';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

function startServer() {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);

    // ── Socket.io ──────────────────────────────────────
    const io = new SocketServer(httpServer, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
      path: '/socket.io',
    });
    setupVisitorSocket(io);

    // ── Express Middleware ─────────────────────────────
    server.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
    server.use(cors({
      origin: process.env.APP_URL || 'http://localhost:3000',
      credentials: true,
    }));
    server.use(cookieParser());
    server.use(express.json({ limit: '10mb' }));
    server.use(express.urlencoded({ extended: true }));
    server.use(morgan(dev ? 'dev' : 'combined'));

    // ── Serve uploaded files ───────────────────────────
    server.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

    // ── API Routes (Express) ──────────────────────────
    server.use('/api', apiRouter);

    // ── Error handling ────────────────────────────────
    server.use(errorMiddleware);

    // ── Next.js handler (catch-all) ───────────────────
    server.use((req, res) => {
      return handle(req, res);
    });

    // ── Start server ──────────────────────────────────
    const startListening = (currentPort: number) => {
      httpServer.listen(currentPort, () => {
        console.log(`
        ╔══════════════════════════════════════════╗
        ║         🎮 SkyLogic CMS Started           ║
        ║──────────────────────────────────────────║
        ║  Mode:    ${dev ? 'Development' : 'Production '}                   ║
        ║  Port:    ${currentPort}                             ║
        ║  URL:     http://localhost:${currentPort}             ║
        ║  API:     http://localhost:${currentPort}/api          ║
        ╚══════════════════════════════════════════╝
        `);
      }).on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          const fallbackPort = currentPort + 1;
          console.warn(`Port ${currentPort} is busy, trying ${fallbackPort}`);
          startListening(fallbackPort);
        } else {
          console.error(error);
        }
      });
    };

    startListening(port);
  });
}

startServer();

