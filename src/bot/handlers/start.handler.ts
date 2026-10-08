import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, upsertTelegramUser, isUserPremium } from '@/src/lib/db/user.service';
import { getContactShareKeyboard } from '@/src/bot/keyboards/contact.keyboard';
import { getMainReplyKeyboard } from '@/src/bot/keyboards/main.keyboard';
import { getTranslation, SupportedLanguage } from '@/src/bot/i18n/translations';

/**
 * Handle /start command with Multilingual & Screenshot layout support
 */
export async function handleStart(ctx: MyContext) {
  if (!ctx.from) return;

  const telegramId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Student';
  const lastName = ctx.from.last_name || undefined;
  const username = ctx.from.username || undefined;

  // 1. Check or partially create student record in database
  let user = await getUserByTelegramId(telegramId);

  if (!user) {
    user = await upsertTelegramUser({
      telegramId,
      firstName,
      lastName,
      username,
      languageCode: 'am',
      grade: 'Freshman Year',
    });
  }

  const lang = (user.languageCode as SupportedLanguage) || 'am';
  const t = getTranslation(lang);

  // 2. If phone number is not yet provided, prompt with contact button
  if (!user.phoneNumber || user.phoneNumber.trim() === '') {
    const welcomePrompt =
      `${t.welcome_title}\n` +
      `Welcome **${firstName}** to Ethiopian Freshman Platform! 🇪🇹📚\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 **${t.btn_materials}** (Course Modules)\n` +
      `📌 **${t.btn_saved}** (Handouts & Notes)\n` +
      `📌 **${t.btn_exams}** (Mid & Final Exams)\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `${t.welcome_prompt_phone}\n\n` +
      `👇 **ከታች ያለውን በተን ይጫኑ (Tap button below):**`;

    await ctx.reply(welcomePrompt, {
      parse_mode: 'Markdown',
      reply_markup: getContactShareKeyboard(),
    });
    return;
  }

  // 3. User is registered: status is 100% Unlocked VIP
  const isPremium = await isUserPremium(telegramId);
  const statusBadge = '💎 **VIP Premium Unlocked (ሙሉ በሙሉ ክፍት)** ⭐';
  const streamInfo = user.stream ? `🔬 **${user.stream} Science**` : '🔬 *Natural / Social Science*';

  const welcomeMessage =
    `${t.welcome_title}\n\n` +
    `👤 **ተማሪ (Student):** ${firstName} ${lastName || ''}\n` +
    `📱 **ስልክ (Phone):** \`${user.phoneNumber}\` ✅\n` +
    `📊 **ደረጃ (Status):** ${statusBadge}\n` +
    `🌐 **ቋንቋ (Language):** ${lang.toUpperCase()}\n` +
    `📚 **የትምህርት ዘርፍ:** ${streamInfo}\n\n` +
    `${t.choose_resources}`;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: getMainReplyKeyboard(isPremium, lang),
  });
}
