import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// In-memory store (use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = identifier;

  let record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + config.windowMs };
    requestCounts.set(key, record);
  }

  record.count++;

  if (record.count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetIn: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Get client identifier from request headers
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return `rate:${ip}`;
}
