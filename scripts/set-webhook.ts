import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Bot } from 'grammy';
import { BOT_CONFIG, validateBotConfig } from '../src/bot/config';

async function setupWebhook() {
  const config = validateBotConfig();
  if (!config.isValid) {
    console.error('❌ Configuration Error:', config.error);
    process.exit(1);
  }

  const webhookUrl = process.argv[2] || process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/bot`
    : null;

  const bot = new Bot(BOT_CONFIG.token);

  if (!webhookUrl) {
    console.log('Usage: npx tsx scripts/set-webhook.ts <https://your-domain.com/api/bot>');
    console.log('Or set NEXT_PUBLIC_APP_URL in .env.local');
    const info = await bot.api.getWebhookInfo();
    console.log('\n📊 Current Webhook Status in Telegram:');
    console.log(JSON.stringify(info, null, 2));
    return;
  }

  console.log(`🔗 Setting Telegram Webhook URL to: ${webhookUrl}`);
  await bot.api.setWebhook(webhookUrl);
  console.log('✅ Webhook successfully configured!');

  const info = await bot.api.getWebhookInfo();
  console.log('\n📊 Updated Webhook Status:');
  console.log(JSON.stringify(info, null, 2));
}

setupWebhook().catch((err) => {
  console.error('❌ Failed to set webhook:', err);
  process.exit(1);
});
