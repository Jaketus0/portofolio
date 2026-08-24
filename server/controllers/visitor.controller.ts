import { Request, Response, NextFunction } from 'express';
import { visitorService } from '../services/visitor.service';
import { sendSuccess } from '../utils/response';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export const visitorController = {
  async trackVisitor(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, referrer, sessionId } = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const ipAddress = Array.isArray(ip) ? ip[0] : ip?.split(',')[0];
      
      const userAgent = req.headers['user-agent'];
      const parsedUA = new UAParser(userAgent || '').getResult();
      
      let country = null;
      let city = null;
      
      if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== '::1') {
        const geo = geoip.lookup(ipAddress);
        if (geo) {
          country = geo.country;
          city = geo.city;
        }
      }

      await visitorService.trackVisitor({
        ipAddress,
        country,
        city,
        browser: parsedUA.browser.name,
        os: parsedUA.os.name,
        device: parsedUA.device.type || 'desktop',
        page,
        referrer,
        sessionId,
      });

      sendSuccess(res, null, 'Visit tracked');
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await visitorService.getAnalyticsStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  },

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await visitorService.getVisitorAnalytics();
      sendSuccess(res, analytics);
    } catch (error) {
      next(error);
    }
  }
};
