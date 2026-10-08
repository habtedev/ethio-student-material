import { Bot } from 'grammy';
import { MyContext } from '@/src/bot/types/bot.types';
import { BOT_CONFIG } from '@/src/bot/config';
import { handleStart } from '@/src/bot/handlers/start.handler';
import { handleContact } from '@/src/bot/handlers/contact.handler';
import {
  handleStreamSelect,
  handleMenuNavigation,
  handleCourseDownload,
  handleUniversityInfo,
  handleDepartmentInfo,
  handleStudyTools,
  handleMaterialCategory,
} from '@/src/bot/handlers/menu.handler';
import { handleHelp, handleProfile, handleSetPremium, handleUnlock } from '@/src/bot/handlers/help.handler';
import { handleTextButton, sendPremiumPlansMessage } from '@/src/bot/handlers/button.handler';
import { handleLanguageCommand, handleSetLanguageCallback } from '@/src/bot/handlers/language.handler';
import { handleReceiptUpload } from '@/src/bot/handlers/receipt.handler';

/**
 * Create and configure grammY bot instance for Ethiopian University Freshman Students
 * Multilingual: Amharic, English, Afaan Oromoo, Tigrigna
 */
export function createBot(token?: string): Bot<MyContext> {
  const botToken = token || BOT_CONFIG.token;
  if (!botToken) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN is missing. Bot initialized with placeholder token.');
  }

  const bot = new Bot<MyContext>(botToken || 'dummy_token');

  // Middleware: Request Logger
  bot.use(async (ctx, next) => {
    const start = Date.now();
    try {
      await next();
    } finally {
      const ms = Date.now() - start;
      const user = ctx.from?.username || ctx.from?.first_name || 'Freshman';
      console.log(`[Freshman Bot] ${ctx.update.update_id} | ${user} (${ctx.from?.id}) | ${ms}ms`);
    }
  });

  // Direct Commands
  bot.command('start', handleStart);
  bot.command('unlock', handleUnlock);
  bot.command('vip', handleUnlock);
  bot.command('language', handleLanguageCommand);
  bot.command('help', handleHelp);
  bot.command('profile', handleProfile);
  bot.command('premium', (ctx) => sendPremiumPlansMessage(ctx));
  bot.command('setpremium', handleSetPremium);

  // Message Handlers
  bot.on('message:contact', handleContact);
  bot.on('message:photo', handleReceiptUpload);
  bot.on('message:document', handleReceiptUpload);

  // Persistent Reply Keyboard Button clicks matching screenshot
  // 📖 መርጃዎች, 🏷️ በፍጥነት የተቀመጡ, 🏆 ፈተናዎች, 👤 መገለጫ, 👥 ይጋብዙ, 🌐 ቋንቋ, 💎 ፕሪሚየም
  bot.on('message:text', handleTextButton);

  // Callback Query Handlers (Inline Buttons)
  bot.callbackQuery(/^set_lang:/, handleSetLanguageCallback);
  bot.callbackQuery(/^select_stream:/, handleStreamSelect);
  bot.callbackQuery(/^mat_cat:/, handleMaterialCategory);
  bot.callbackQuery(/^course:/, handleCourseDownload);
  bot.callbackQuery(/^uni:/, handleUniversityInfo);
  bot.callbackQuery(/^dept:/, handleDepartmentInfo);
  bot.callbackQuery(/^tool:/, handleStudyTools);
  bot.callbackQuery(/^(menu|premium|pay):/, handleMenuNavigation);

  // Global Error Handler
  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`❌ Error while handling update ${ctx.update.update_id}:`, err.error);
  });

  return bot;
}

// Singleton bot instance for Webhooks and API routes
export const bot = createBot();
