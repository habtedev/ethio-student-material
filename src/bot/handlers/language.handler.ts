import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, upsertTelegramUser, isUserPremium } from '@/src/lib/db/user.service';
import { getLanguageSelectionKeyboard, getMainReplyKeyboard } from '@/src/bot/keyboards/main.keyboard';
import { getTranslation, SupportedLanguage } from '@/src/bot/i18n/translations';

/**
 * Handle /language command or 🌐 ቋንቋ button click
 */
export async function handleLanguageCommand(ctx: MyContext) {
  if (!ctx.from) return;

  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId);
  const lang = (user?.languageCode as SupportedLanguage) || 'am';
  const t = getTranslation(lang);

  await ctx.reply(t.select_language, {
    parse_mode: 'Markdown',
    reply_markup: getLanguageSelectionKeyboard(),
  });
}

/**
 * Handle Language Selection Callback (set_lang:am | set_lang:en | set_lang:or | set_lang:ti)
 */
export async function handleSetLanguageCallback(ctx: MyContext) {
  if (!ctx.callbackQuery || !ctx.callbackQuery.data || !ctx.from) return;
  await ctx.answerCallbackQuery();

  const data = ctx.callbackQuery.data;
  const langCode = data.replace('set_lang:', '') as SupportedLanguage;
  const telegramId = ctx.from.id;

  // Update in Firebase Firestore
  await upsertTelegramUser({
    telegramId,
    languageCode: langCode,
  });

  const isPremium = await isUserPremium(telegramId);
  const t = getTranslation(langCode);

  await ctx.reply(t.language_changed, {
    parse_mode: 'Markdown',
    reply_markup: getMainReplyKeyboard(isPremium, langCode),
  });
}
