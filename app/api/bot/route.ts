import { NextRequest, NextResponse } from 'next/server';
import { webhookCallback } from 'grammy';
import { bot } from '@/src/bot/bot';
import { BOT_CONFIG, validateBotConfig } from '@/src/bot/config';
import { adminDb } from '@/src/lib/firebase/admin';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// grammY Webhook handler for Standard HTTP / Next.js App Router
const handleUpdate = webhookCallback(bot, 'std/http');

/**
 * Telegram Bot Webhook POST Handler
 */
export async function POST(req: NextRequest) {
  const config = validateBotConfig();
  if (!config.isValid) {
    return NextResponse.json(
      { error: 'Bot is not configured', details: config.error },
      { status: 500 }
    );
  }

  try {
    return await handleUpdate(req);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Webhook error:', message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/**
 * Health check & bot status GET Handler
 */
export async function GET() {
  const config = validateBotConfig();

  return NextResponse.json({
    ok: true,
    name: BOT_CONFIG.name,
    isBotConfigured: config.isValid,
    isFirebaseConfigured: !!adminDb,
    timestamp: new Date().toISOString(),
    message: config.isValid
      ? 'Bot webhook endpoint is ready and operational.'
      : 'TELEGRAM_BOT_TOKEN is required. Please check .env.local file.',
  });
}
