import { Server, Socket } from 'socket.io';
import { visitorRepository } from '../repositories/visitor.repository';
import { logger } from '../utils/logger';

let onlineVisitors = 0;
const activeSessions = new Set<string>();

export function setupVisitorSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    const sessionId = socket.handshake.query.sessionId as string || socket.id;
    
    if (!activeSessions.has(sessionId)) {
      activeSessions.add(sessionId);
      onlineVisitors++;
      io.emit('visitor_count', onlineVisitors);
      logger.debug(`Visitor connected. Online: ${onlineVisitors}`);
    }

    socket.on('disconnect', () => {
      // In a real production app with multiple tabs per user, 
      // we'd want to track connections per session ID more robustly.
      // For this portfolio CMS, a simple timeout or disconnect event is sufficient.
      setTimeout(() => {
        if (activeSessions.has(sessionId)) {
          activeSessions.delete(sessionId);
          onlineVisitors = Math.max(0, onlineVisitors - 1);
          io.emit('visitor_count', onlineVisitors);
          logger.debug(`Visitor disconnected. Online: ${onlineVisitors}`);
        }
      }, 5000); // 5 second grace period for page reloads
    });

    // Handle manual heartbeat if needed
    socket.on('heartbeat', () => {
      if (!activeSessions.has(sessionId)) {
        activeSessions.add(sessionId);
        onlineVisitors++;
        io.emit('visitor_count', onlineVisitors);
      }
    });
  });

  // Periodically broadcast stats to admin clients
  setInterval(async () => {
    try {
      const stats = await visitorRepository.getStats();
      io.emit('admin_stats_update', {
        ...stats,
        online: onlineVisitors
      });
    } catch (error) {
      logger.error('Failed to broadcast stats:', error);
    }
  }, 30000); // Every 30 seconds
}
