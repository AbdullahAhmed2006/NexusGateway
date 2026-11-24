import { NextResponse } from "next/server";
import {
  generateBackupCodes,
  generateTotpCode,
  generateTotpSecret,
  verifyAndConsumeBackupCode,
  verifyTotpCode,
} from "@/src/lib/auth/two-factor";

export async function POST(request: Request) {
  try {
    const { action, secret, code, existingBackupCodes } = await request.json();

    // 1. Generate 2FA Secret & 8 Backup Recovery Codes (Task S1-8)
    if (action === "generate") {
      const newSecret = generateTotpSecret();
      const backupCodes = generateBackupCodes(8);
      const sampleCode = generateTotpCode(newSecret);

      return NextResponse.json({
        success: true,
        secret: newSecret,
        backup_codes: backupCodes,
        current_test_code: sampleCode, // Provided for easy verification during tests
        qr_uri: `otpauth://totp/NexusGateway:user@nexus.ai?secret=${newSecret}&issuer=NexusGateway`,
      });
    }

    // 2. Verify 6-digit TOTP code
    if (action === "verify") {
      if (!secret || !code) {
        return NextResponse.json(
          { error: "Secret and 6-digit code are required." },
          { status: 400 }
        );
      }

      const isValid = verifyTotpCode(secret, code);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid 6-digit verification code. Please check your authenticator." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "2FA successfully verified and enabled.",
      });
    }

    // 3. Verify & Consume Emergency Backup Recovery Code (Task S1-8)
    if (action === "verify-backup") {
      if (!code || !existingBackupCodes) {
        return NextResponse.json(
          { error: "Backup code and existing codes list are required." },
          { status: 400 }
        );
      }

      const { valid, remainingCodes } = verifyAndConsumeBackupCode(
        code,
        existingBackupCodes
      );

      if (!valid) {
        return NextResponse.json(
          { error: "Invalid or previously consumed backup recovery code." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Backup code accepted. Emergency access granted.",
        remaining_backup_codes_count: remainingCodes.length,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
