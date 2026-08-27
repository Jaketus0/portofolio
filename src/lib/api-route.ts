import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { verifyAccessToken, JwtPayload } from '../../server/utils/jwt';

// ── Response helpers ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
  errors?: unknown;
}

export function jsonSuccess<T>(data: T, message = 'Success', status = 200, meta?: Record<string, unknown>) {
  const body: ApiResponse<T> = { success: true, message, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

export function jsonCreated<T>(data: T, message = 'Created successfully') {
  return jsonSuccess(data, message, 201);
}

export function jsonError(message = 'Internal server error', status = 500, errors?: unknown) {
  const body: ApiResponse = { success: false, message };
  if (errors) body.errors = errors;
  return NextResponse.json(body, { status });
}

export function jsonNotFound(entity = 'Resource') {
  return jsonError(`${entity} not found`, 404);
}

export function jsonBadRequest(message = 'Bad request', errors?: unknown) {
  return jsonError(message, 400, errors);
}

export function jsonUnauthorized(message = 'Unauthorized') {
  return jsonError(message, 401);
}

export function jsonForbidden(message = 'Forbidden') {
  return jsonError(message, 403);
}

export function jsonTooMany(message = 'Too many requests') {
  return jsonError(message, 429);
}

// ── Auth helper ──────────────────────────────────────────
export function getAdmin(req: NextRequest): JwtPayload | null {
  try {
    let token: string | undefined;

    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      token = req.cookies.get('accessToken')?.value;
    }

    if (!token) return null;

    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function requireAdmin(req: NextRequest): JwtPayload | NextResponse {
  const admin = getAdmin(req);
  if (!admin) return jsonUnauthorized();
  return admin;
}

// ── Validation helper ────────────────────────────────────
export async function validateBody<T>(schema: ZodSchema<T>, data: unknown): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  try {
    return { data: schema.parse(data) };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(e => ({ field: e.path.join('.'), message: e.message }));
      return { error: jsonBadRequest('Validation failed', errors) };
    }
    return { error: jsonBadRequest('Validation failed') };
  }
}

export async function validateRequest<T>(schema: ZodSchema<T>, req: NextRequest, body?: unknown): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  const url = new URL(req.url);
  const payload = {
    body: body ?? {},
    query: Object.fromEntries(url.searchParams),
    params: {},
    ...(body ?? {}),
  };
  return validateBody(schema, payload);
}

// ── Error handler wrapper ────────────────────────────────
export function apiHandler(handler: (req: NextRequest, ctx?: any) => Promise<Response>) {
  return async (req: NextRequest, ctx?: any) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error('[API Error]', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      return jsonError(process.env.NODE_ENV === 'production' ? 'Internal server error' : message);
    }
  };
}

// ── JSON body parser with size limit ─────────────────────
export async function readBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const text = await req.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// ── URL params helper ────────────────────────────────────
export function getParam(req: NextRequest, name: string, ctx?: { params: Promise<Record<string, string>> }): string | null {
  // For dynamic routes, params come from context
  if (ctx?.params) {
    // This is sync in Next.js 15, but we await it in the handler
    return null; // Will be handled by awaiting params in the route
  }
  return null;
}

// ── Simple in-memory rate limiter ───────────────────────
// ponytail: in-memory store only; works for a single server instance. Swap to a
// shared store (e.g. Redis via Upstash) when you scale beyond one instance.
const rateLimitStore = new Map<string, { count: number; reset: number }>();

export function rateLimiter(req: NextRequest, windowMs = 60_000, max = 5): NextResponse | null {
  const forwarded = req.headers.get('x-forwarded-for');
  const key = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.reset <= now) {
    rateLimitStore.set(key, { count: 1, reset: now + windowMs });
    return null;
  }
  if (entry.count >= max) return jsonTooMany();
  entry.count++;
  return null;
}
