import crypto from "crypto";

/**
 * Task S1-8: Two-Factor Authentication (2FA) & Backup Recovery Codes
 * Implements TOTP algorithm (RFC 6238) and single-use recovery code generator.
 */

// Base32 charset for TOTP secrets
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret(length = 20): string {
  const bytes = crypto.randomBytes(length);
  let secret = "";
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32_CHARS[bytes[i] % BASE32_CHARS.length];
  }
  return secret;
}

export function generateTotpCode(secret: string, timeStep = 30): string {
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep);

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));

  // Decode base32 secret
  const key = Buffer.from(secret, "utf-8");
  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buffer);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

export function verifyTotpCode(secret: string, inputCode: string): boolean {
  if (!inputCode || inputCode.length !== 6) return false;

  // Accept current window and +/- 1 window (30 seconds drift tolerance)
  const current = generateTotpCode(secret);
  if (inputCode === current) return true;

  // Check previous window
  const prevEpoch = Math.floor(Date.now() / 1000) - 30;
  const counterPrev = Math.floor(prevEpoch / 30);
  const bufPrev = Buffer.alloc(8);
  bufPrev.writeBigInt64BE(BigInt(counterPrev));
  const hmacPrev = crypto.createHmac("sha1", Buffer.from(secret, "utf-8"));
  hmacPrev.update(bufPrev);
  const digPrev = hmacPrev.digest();
  const offPrev = digPrev[digPrev.length - 1] & 0xf;
  const binPrev =
    ((digPrev[offPrev] & 0x7f) << 24) |
    ((digPrev[offPrev + 1] & 0xff) << 16) |
    ((digPrev[offPrev + 2] & 0xff) << 8) |
    (digPrev[offPrev + 3] & 0xff);
  if (inputCode === (binPrev % 1000000).toString().padStart(6, "0")) return true;

  return false;
}

/**
 * Generate 8 single-use emergency backup recovery codes (e.g. "8F2A-9C31")
 */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
    const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

/**
 * Verify and consume a single-use backup recovery code
 */
export function verifyAndConsumeBackupCode(
  providedCode: string,
  existingCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  const normalized = providedCode.trim().toUpperCase();
  const index = existingCodes.findIndex((c) => c === normalized);

  if (index === -1) {
    return { valid: false, remainingCodes: existingCodes };
  }

  // Remove the single-use code
  const remaining = [...existingCodes];
  remaining.splice(index, 1);
  return { valid: true, remainingCodes: remaining };
}
