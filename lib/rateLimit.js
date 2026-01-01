import { logWarn } from './logger';

const ipRequestCounts = new Map();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10);

function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      ipRequestCounts.delete(ip);
    }
  }
}

setInterval(cleanupOldEntries, 60000);

export function rateLimit(req) {
  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  let ipData = ipRequestCounts.get(ip);

  if (!ipData || now - ipData.windowStart > RATE_LIMIT_WINDOW) {
    ipData = {
      count: 0,
      windowStart: now,
    };
    ipRequestCounts.set(ip, ipData);
  }

  ipData.count++;

  const remaining = Math.max(0, RATE_LIMIT_MAX - ipData.count);
  const resetTime = new Date(ipData.windowStart + RATE_LIMIT_WINDOW);

  if (ipData.count > RATE_LIMIT_MAX) {
    logWarn('Rate limit exceeded', {
      ip,
      count: ipData.count,
      max: RATE_LIMIT_MAX,
    });

    return {
      allowed: false,
      remaining: 0,
      resetTime,
      retryAfter: Math.ceil((ipData.windowStart + RATE_LIMIT_WINDOW - now) / 1000),
    };
  }

  return {
    allowed: true,
    remaining,
    resetTime,
    retryAfter: null,
  };
}

export function rateLimitMiddleware(handler) {
  return async (req, res) => {
    const rateLimitResult = rateLimit(req);

    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
    res.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());

    if (!rateLimitResult.allowed) {
      res.setHeader('Retry-After', rateLimitResult.retryAfter);
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter,
      });
    }

    return handler(req, res);
  };
}

export default rateLimitMiddleware;
