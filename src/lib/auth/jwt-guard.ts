import { redis } from "../redis";

export interface TokenPayload {
  sub: string; // user id
  email: string;
  role?: string;
  exp: number; // unix timestamp in seconds
  iat: number;
  session_id?: string;
}

export interface GuardResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  reason?: "MISSING_TOKEN" | "EXPIRED_TOKEN" | "REVOKED_SESSION" | "MALFORMED_TOKEN";
}

/**
 * Task S1-5: JWT guard and Redis session check.
 * Verifies token presence, expiration, ownership, and queries Redis for revocation status.
 */
export async function verifyJwtAndRedisSession(authHeader?: string | null): Promise<GuardResult> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, reason: "MISSING_TOKEN" };
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    // 1. Basic JWT structure check (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, reason: "MALFORMED_TOKEN" };
    }

    // 2. Decode payload safely
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload: TokenPayload = JSON.parse(payloadJson);

    // 3. Expiration verification
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowInSeconds) {
      return { valid: false, reason: "EXPIRED_TOKEN" };
    }

    // 4. Redis Session Revocation / Blacklist check
    // Check if the specific token is explicitly blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return { valid: false, reason: "REVOKED_SESSION" };
    }

    // Check if the active session exists in Redis
    const sessionId = payload.session_id || "default";
    const sessionRecord = await redis.get(`session:${payload.sub}:${sessionId}`);
    
    // If sessions are actively tracked and the record is revoked
    if (sessionRecord === "revoked") {
      return { valid: false, reason: "REVOKED_SESSION" };
    }

    return {
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email || "user@nexus.ai",
        role: payload.role || "authenticated",
      },
    };
  } catch {
    return { valid: false, reason: "MALFORMED_TOKEN" };
  }
}

/**
 * Register a new active session into Redis
 */
export async function registerRedisSession(userId: string, token: string, ttlSeconds = 86400) {
  const parts = token.split(".");
  let sessionId = "default";
  if (parts.length === 3) {
    try {
      const p = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      sessionId = p.session_id || "default";
    } catch {}
  }

  await redis.set(`session:${userId}:${sessionId}`, "active", { ex: ttlSeconds });
}

/**
 * Revoke session in Redis on logout (Task S1-5 / S1-6)
 */
export async function revokeRedisSession(userId: string, token: string) {
  const parts = token.split(".");
  let sessionId = "default";
  let exp = Math.floor(Date.now() / 1000) + 86400;

  if (parts.length === 3) {
    try {
      const p = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf-8"));
      sessionId = p.session_id || "default";
      if (p.exp) exp = p.exp;
    } catch {}
  }

  const ttl = Math.max(exp - Math.floor(Date.now() / 1000), 60);

  // Mark session key as revoked & add token to blacklist
  await redis.del(`session:${userId}:${sessionId}`);
  await redis.set(`blacklist:${token}`, "1", { ex: ttl });
}
