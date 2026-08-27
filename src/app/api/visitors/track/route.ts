import { NextRequest } from 'next/server';
import { apiHandler, jsonSuccess, readBody, rateLimiter } from '@/lib/api-route';
import { visitorService } from '@server/services/visitor.service';
import geoip from 'geoip-lite';
import { UAParser } from 'ua-parser-js';

export const POST = apiHandler(async (req: NextRequest) => {
  const rl = rateLimiter(req, 60_000, 100);
  if (rl) return rl;
  const body = await readBody(req);
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '';
  const userAgent = req.headers.get('user-agent') || '';
  const parser = new UAParser(userAgent);
  const geo = ip ? geoip.lookup(ip) : null;
  const result = await visitorService.trackVisitor({
    ipAddress: ip || undefined,
    country: geo?.country,
    city: geo?.city,
    browser: parser.getBrowser().name || undefined,
    os: parser.getOS().name || undefined,
    device: parser.getDevice().type || undefined,
    page: body.page as string,
    referrer: (body.referrer as string) || undefined,
    sessionId: body.sessionId as string,
  });
  return jsonSuccess(result);
});