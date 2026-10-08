import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { createBot } from '../src/bot/bot';
import { BOT_CONFIG, validateBotConfig } from '../src/bot/config';
import { adminDb } from '../src/lib/firebase/admin';

async function startDevBot() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖 Starting Ethio Student Material Bot (Dev Polling)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const config = validateBotConfig();
  if (!config.isValid) {
    console.error('\n❌ Configuration Error:', config.error);
    console.error('👉 Please set TELEGRAM_BOT_TOKEN in .env.local file.\n');
    process.exit(1);
  }

  if (adminDb) {
    console.log('🔥 Firebase Firestore: Connected (Spark / Free Plan)');
  } else {
    console.log('⚠️ Firebase credentials not detected in .env.local; using in-memory store for testing.');
  }

  const bot = createBot(BOT_CONFIG.token);

  console.log('🚀 Deleting any existing webhooks to enable Long Polling...');
  try {
    await bot.api.deleteWebhook({ drop_pending_updates: false });
  } catch (err) {
    console.warn('⚠️ Note on webhook deletion:', err);
  }

  console.log(`✨ Bot is listening for updates! Send /start in Telegram.`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  bot.start({
    onStart: (botInfo) => {
      console.log(`🤖 Bot @${botInfo.username} (${botInfo.first_name}) is online!`);
    },
  });
}

startDevBot().catch((err) => {
  console.error('❌ Fatal error starting dev bot:', err);
  process.exit(1);
});
