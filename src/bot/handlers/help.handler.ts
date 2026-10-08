import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, isUserPremium, setPremiumStatus } from '@/src/lib/db/user.service';
import { getMainReplyKeyboard } from '@/src/bot/keyboards/main.keyboard';

/**
 * Handle /help command
 */
export async function handleHelp(ctx: MyContext) {
  const isPremium = ctx.from ? await isUserPremium(ctx.from.id) : false;

  const helpText =
    `📖 **Ethio Student Material Bot - User Guide**\n\n` +
    `🤖 **Available Commands:**\n` +
    `• /start - Start the bot & open navigation menu\n` +
    `• /profile - View your registered profile & phone number\n` +
    `• /premium - View VIP plans and unlock status\n` +
    `• /help - Display this help message\n\n` +
    `🇪🇹 **Ethiopian Student Resources (VIP Unlocked):**\n` +
    `• Modules & Course Materials (All Semesters)\n` +
    `• Lecture Notes & Chapter Summaries\n` +
    `• Worksheets & Assignments with Solutions\n` +
    `• Past Mid & Final Exams with Answer Keys\n` +
    `• Reference Textbooks (Calculus, Physics, Logic)\n` +
    `• University & Department Placement Guides\n\n` +
    `💬 Need assistance? Contact support at @ethiostudentsupport`;

  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    reply_markup: getMainReplyKeyboard(true),
  });
}

/**
 * Handle /profile command
 */
export async function handleProfile(ctx: MyContext) {
  if (!ctx.from) return;

  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId);

  const statusText = '💎 **VIP Premium Member (All Unlocked)** ⭐';
  const expiresText = user?.premiumUntil
    ? `\n⏳ **Expires:** ${new Date(user.premiumUntil).toLocaleDateString()}`
    : '\n⏳ **Access:** Lifetime VIP Access';

  const profileText =
    `👤 **የተማሪው መረጃ (Student Profile)**\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 **Telegram ID:** \`${telegramId}\`\n` +
    `📛 **ስም (Name):** ${user?.firstName || ctx.from.first_name} ${user?.lastName || ''}\n` +
    `📱 **ስልክ (Phone):** \`${user?.phoneNumber || 'Not linked'}\`\n` +
    `🎓 **ክፍል (Grade):** ${user?.grade || 'Freshman Year'}\n` +
    `🔬 **ዘርፍ (Stream):** ${user?.stream || 'Natural'} Science\n` +
    `📊 **ደረጃ (Status):** ${statusText}${expiresText}\n` +
    `📅 **የተመዘገበበት ቀን (Joined):** ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `✨ _ሁሉም የትምህርት መርጃዎችና ፈተናዎች ለእርስዎ ክፍት ናቸው!_`;

  await ctx.reply(profileText, {
    parse_mode: 'Markdown',
    reply_markup: getMainReplyKeyboard(true),
  });
}

/**
 * Handle Admin command: /setpremium <telegramId> [true/false]
 */
export async function handleSetPremium(ctx: MyContext) {
  if (!ctx.message || !ctx.message.text || !ctx.from) return;

  const args = ctx.message.text.trim().split(/\s+/);
  if (args.length < 2) {
    await ctx.reply(
      '⚠️ **Usage:** `/setpremium <telegramId> [true/false] [days]`\nExample: `/setpremium 12345678 true 30`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  const targetTelegramId = parseInt(args[1], 10);
  if (isNaN(targetTelegramId)) {
    await ctx.reply('❌ Invalid Telegram ID. Must be numbers.');
    return;
  }

  const status = args[2] ? args[2].toLowerCase() === 'true' : true;
  const days = args[3] ? parseInt(args[3], 10) : 30;

  const updatedUser = await setPremiumStatus(targetTelegramId, status, days);

  if (!updatedUser) {
    await ctx.reply(`❌ User with Telegram ID \`${targetTelegramId}\` not found in database.`, {
      parse_mode: 'Markdown',
    });
    return;
  }

  await ctx.reply(
    `✅ **Premium Status Updated!**\n\n` +
      `👤 **User:** ${updatedUser.firstName} (\`${targetTelegramId}\`)\n` +
      `💎 **Premium:** ${status ? 'ACTIVE (TRUE)' : 'INACTIVE (FALSE)'}\n` +
      `⏳ **Valid for:** ${days} days\n` +
      `📅 **Expires:** ${updatedUser.premiumUntil || 'N/A'}`,
    { parse_mode: 'Markdown' }
  );
}

/**
 * Handle 1-click self unlock command: /unlock or /vip
 */
export async function handleUnlock(ctx: MyContext) {
  if (!ctx.from) return;
  const telegramId = ctx.from.id;
  const user = await setPremiumStatus(telegramId, true, 3650);
  const lang = (user?.languageCode as any) || 'am';

  await ctx.reply(
    `🎉 **እንኳን ደስ አለዎት ${ctx.from.first_name}! ፕሪሚየምዎ ተከፍቷል (VIP UNLOCKED!)** 🎓\n\n` +
      `ሁሉም የ Freshman ሞጁሎች፣ ማስታወሻዎች፣ ወርክሺቶች፣ ፈተናዎች እና ሪፈረንስ መጽሐፍት ለእርስዎ ክፍት ሆነዋል!\n\n` +
      `ከታች ያሉትን በተኖች በመጫን በነፃነት ይጠቀሙ 👇`,
    {
      parse_mode: 'Markdown',
      reply_markup: getMainReplyKeyboard(true, lang),
    }
  );
}
