import { MyContext } from '@/src/bot/types/bot.types';
import { upsertTelegramUser, isUserPremium } from '@/src/lib/db/user.service';
import { getMainReplyKeyboard, getFreshmanStreamKeyboard } from '@/src/bot/keyboards/main.keyboard';
import { getTranslation, SupportedLanguage } from '@/src/bot/i18n/translations';

/**
 * Handle incoming Contact sharing message
 */
export async function handleContact(ctx: MyContext) {
  if (!ctx.message || !ctx.message.contact || !ctx.from) return;

  const contact = ctx.message.contact;
  const telegramId = ctx.from.id;

  if (contact.user_id && contact.user_id !== telegramId) {
    await ctx.reply(
      '⚠️ **የተሳሳተ ስልክ ቁጥር!**\nእባክዎ የእራስዎን ስልክ ቁጥር "Share Phone Number" የሚለውን በተን በመጫን ያጋሩ።',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  let rawPhone = contact.phone_number.trim();
  if (!rawPhone.startsWith('+')) {
    rawPhone = '+' + rawPhone;
  }

  try {
    const updatedUser = await upsertTelegramUser({
      telegramId,
      firstName: ctx.from.first_name || contact.first_name || 'Freshman',
      lastName: ctx.from.last_name || contact.last_name || undefined,
      username: ctx.from.username || undefined,
      phoneNumber: rawPhone,
      isVerified: true,
      grade: 'Freshman Year',
      role: 'student',
    });

    const isPremium = await isUserPremium(telegramId);
    const lang = (updatedUser.languageCode as SupportedLanguage) || 'am';
    const t = getTranslation(lang);

    console.log(`✅ Student registered in Firebase: ID=${telegramId}, Phone=${rawPhone}, Premium=${isPremium}`);

    const successMsg =
      `🎉 **እንኳን ደስ አለዎት ${updatedUser.firstName}!**\n\n` +
      `${t.phone_verified} (\`${rawPhone}\`)\n\n` +
      `📌 **የቦቱ አጠቃቀም (VIP Unlocked):**\n` +
      `• ✨ ሁሉም የ Freshman ሞጁሎች፣ ፈተናዎች እና የዲፓርትመንት መረጃዎች ለእርስዎ ክፍት ናቸው!\n\n` +
      `${t.choose_resources}`;

    await ctx.reply(successMsg, {
      parse_mode: 'Markdown',
      reply_markup: getMainReplyKeyboard(isPremium, lang),
    });

    await ctx.reply('👇 **የመምረጫ ዘርፍዎን ይምረጡ (Select Natural or Social):**', {
      parse_mode: 'Markdown',
      reply_markup: getFreshmanStreamKeyboard(lang),
    });
  } catch (error) {
    console.error('❌ Failed to process contact sharing:', error);
    await ctx.reply(
      '❌ ይቅርታ፣ መረጃዎን በዳታቤዝ ውስጥ ለመመዝገብ ስህተት አጋጥሟል። እባክዎ ጥቂት ቆይተው እንደገና ይሞክሩ።',
      { parse_mode: 'Markdown' }
    );
  }
}
