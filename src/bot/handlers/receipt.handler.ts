import { MyContext } from '@/src/bot/types/bot.types';
import { getUserByTelegramId, isUserPremium } from '@/src/lib/db/user.service';
import { InlineKeyboard } from 'grammy';

/**
 * Handle incoming Payment Screenshot / Receipt (Photos & Documents)
 */
export async function handleReceiptUpload(ctx: MyContext) {
  if (!ctx.from) return;

  const telegramId = ctx.from.id;
  const firstName = ctx.from.first_name || 'Student';
  const lastName = ctx.from.last_name || '';
  const username = ctx.from.username ? `@${ctx.from.username}` : 'No username';
  const isPremium = await isUserPremium(telegramId);
  const now = new Date().toLocaleString();

  console.log(`[Receipt Upload] Received payment proof from ${firstName} (${telegramId})`);

  const responseText =
    `✅ **የክፍያ ደረሰኝዎ በተሳካ ሁኔታ ደርሶናል! (Payment Receipt Received)**\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 **ተማሪ (Student):** ${firstName} ${lastName}\n` +
    `🆔 **Telegram ID:** \`${telegramId}\`\n` +
    `📛 **Username:** ${username}\n` +
    `📅 **የተላከበት ቀን:** ${now}\n` +
    `📊 **ሁኔታ (Status):** ⏳ በመረጋገጥ ላይ (Pending Verification)\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📌 **ቀጣይ ሂደት (Next Steps):**\n` +
    `1️⃣ አድሚኖቻችን የከፈሉበትን ደረሰኝ አረጋግጠው በ 5-10 ደቂቃዎች ውስጥ የእርስዎን 💎 **VIP Premium** ያበሩልዎታል!\n` +
    `2️⃣ ፈጣን ማረጋገጫ ከፈለጉ ይህንን ስክሪንሾት እና የእርስዎን ID \`${telegramId}\` በቀጥታ ለአድሚን ይላኩ: @ethiostudentsupport\n\n` +
    `_ስለ መረጡን እናመሰግናለን! 🇪🇹_`;

  const keyboard = new InlineKeyboard()
    .url('💬 Forward to Admin (@ethiostudentsupport)', 'https://t.me/ethiostudentsupport')
    .row()
    .text('🔄 Check VIP Status (ሁኔታ አረጋግጥ)', 'premium:check_status')
    .row()
    .text('🏠 Main Menu (ዋና ማውጫ)', 'menu:main_free');

  await ctx.reply(responseText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}
